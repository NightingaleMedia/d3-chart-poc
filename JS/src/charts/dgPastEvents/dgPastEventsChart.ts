import {
  axisBottom,
  axisLeft,
  axisTop,
  extent,
  scaleBand,
  scaleUtc,
  select,
  selectAll,
  timeFormat,
  timeHour,
  timeMonth,
  transition,
  timeParse,
  utcFormat,
  utcMonth,
} from 'd3';
// import { utcMonth } from "d3.js";
import { colorMap, iconMap } from './utils/icons.js';
import allEvents from '../../data/dg-events.json';
import { DGPastEvent, DGPastEventDataItem } from '../types/DGPastEvents';
import { flattenData } from './utils/flattenData.js';
import { filterResponse } from './utils/filterResponseToChartData.js';
import { getDisplayNameFromType } from './utils/dgEventMap.js';

var svg;
var chartG;

var xScale;
var yScale;
var xAxis;
var yAxis;

export const makeDGPastEventChart = (
  svgId: string,
  initData: DGPastEvent[]
) => {
  svg = select(`svg#${svgId}`);

  var margin = { top: 50, right: 50, bottom: 30, left: 50 },
    tooltipHeight = 110,
    tooltipWidth = Number(svg.attr('width')) - margin.left - margin.right,
    width = svg.attr('width') - margin.left - margin.right,
    height = svg.attr('height') - margin.top - margin.bottom - tooltipHeight;
  // console.log("setup...");
  chartG = svg
    .append('g')
    .attr('class', `chart-group--${svgId}`)
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .attr('width', width)
    .attr('height', height);

  const bg = chartG
    .append('rect')
    .style('fill', 'var(--zss-chart-bg)')
    .attr('rx', 6)
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .attr('transform', `translate(${-margin.left}, ${-margin.top})`);

  const tooltipBox = chartG
    .append('g')
    // .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .attr('class', 'tooltip-group');

  tooltipBox
    .append('rect')
    .attr('height', tooltipHeight)
    .attr('width', 150)
    .attr('fill', 'steelBlue')
    .attr('class', 'tooltip-box')
    .attr('opacity', 0)
    .attr('ry', 3)
    .attr('y', Number(chartG.attr('height')) + margin.top + 10);

  const tooltipDiv = select('.dg-past-event--tooltip').style(
    'top',
    `${Number(chartG.attr('height')) + margin.top + 40}px`
  );

  const toolTipDateDiv = tooltipDiv.select('#dg-past-event--tooltip__date');
  const toolTipNameDiv = tooltipDiv.select('#dg-past-event--tooltip__name');

  const parseTime = timeParse('%m/%d/%Y');

  // Transform data
  /* ##################  RENDER LOGIC   ################## */
  const jsonData = filterResponse(initData as any) as unknown as DGPastEvent[];
  // console.log({ jsonData, flatData, data });
  const data: DGPastEventDataItem[] = jsonData.map((d, i) => ({
    index: i,
    timeset: parseTime(d.Date) ?? new Date(),
    ...d,
  }));

  const flatData = flattenData(data);

  var dataXrange = extent(data, (d) => d.timeset);

  xScale = scaleUtc()
    .domain([dataXrange[0] ?? new Date(), dataXrange[1] ?? new Date()])
    .range([0, width])
    .nice();

  yScale = scaleBand()
    .range([height, 14])
    .domain(['1', '2', '3', '4', '5'])
    .padding(0.1);

  const SINGLE_EVENT_LW = yScale.bandwidth() - 2;

  xAxis = axisBottom(xScale)
    .scale(xScale)
    .ticks(30)
    .tickSize(-5)
    .tickFormat((d) => {
      const f = timeFormat('%-m/%d');
      return f(d as Date);
    });
  yAxis = axisLeft(yScale).scale(yScale).tickSize(-width);

  const x1MonthAxis = axisTop(xScale)
    .scale(xScale)
    .ticks(utcMonth)
    .tickFormat(utcFormat('%B %Y'))
    .tickSize(-height - margin.bottom - margin.top);

  chartG
    .append('g')
    .attr('class', 'y axis')
    .call(yAxis)
    .call((g) =>
      g
        .selectAll('.tick line, .tick text, .domain')
        .attr('stroke-width', 0)
        .style('display', 'none')
        .attr('stroke-opacity', 0)
        .attr('stroke', '0')
    )
    .call((g) => {
      g.selectAll('.tick:first-of-type line')
        .attr('stroke-width', 0)
        .attr('stroke-opacity', 1)
        .attr('stroke', 'white');
      g.selectAll('.tick:last-of-type line')
        .attr('stroke-width', 0)
        .attr('stroke-opacity', 1)
        .attr('stroke', 'white');
    });

  chartG
    .append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0, ${height + 10})`)
    .call(xAxis)
    .call((g) => {
      g.selectAll('.tick text')
        .attr('stroke', 'none')
        .attr('fill', 'white')
        .attr('font-size', '11px')
        .attr('letter-spacing', 0.5);
      g.selectAll('.tick line')
        .attr('stroke-width', 0)
        .attr('stroke-opacity', 1)
        .attr('stroke', 'white');

      g.selectAll('.domain').attr('stroke-width', 0);
    });
  chartG
    .append('g')
    .attr('class', 'xMonthAxis')
    .attr('transform', `translate(${26}, ${-50})`)
    .call(x1MonthAxis)
    .call((g) => {
      g.selectAll('.tick line')
        .attr('stroke-width', 2)
        .attr('stroke-opacity', 1)
        .attr('fill', 'white')
        .attr('stroke', 'var(--zss-chart-axis-line)')
        .style('font-size', '14px');

      g.selectAll('.tick text')
        .attr('fill', 'white')
        // .attr("stroke", "white")
        .attr('opacity', '1')
        .attr('text-anchor', 'start')
        .attr('transform', 'translate(20,40)')
        .style('font-size', 'var(--mud-typography-h6-size)');

      g.selectAll('.domain')
        .attr('stroke-width', 0)
        .attr('stroke-opacity', 1)
        .attr('stroke', 'white');

      // hide inner
      g
        // .selectAll(".tick:not(:first-of-type) line")
        .selectAll(
          '.tick:not(:last-of-type) line, .tick:not(:last-of-type):not(:first-of-type) text '
        )
        .attr('fill', 'none')
        .attr('stroke', 0)
        .attr('text-anchor', 'start')
        .attr('transform', 'translate(16,33)')
        .style('font-size', '16px');
    });

  // individual events

  const squareG = chartG.selectAll('group').data(flatData).enter().append('g');

  squareG
    .append('rect')
    .attr('transform-origin', 'center')
    .attr('y', (d) => yScale(d.keyIndex) ?? '0')
    .attr('x', (d) => xScale(d.timeset) + SINGLE_EVENT_LW / 2)
    .attr('ry', 3)
    .attr('width', SINGLE_EVENT_LW - 5)
    .attr('height', SINGLE_EVENT_LW - 5)
    .style('cursor', 'pointer')
    .attr('opacity', 1)
    .attr('fill', (d) => colorMap(d.type))
    .attr('class', 'dg-square')
    .on('mouseover', function (event, d: any) {
      tooltipDiv
        .transition()
        .duration(500)
        .style('opacity', 1)
        .style('left', `${xScale(d.timeset)}px`);

      toolTipDateDiv.text(() => {
        const f = timeFormat('%m/%d/%y');
        return f(d.timeset);
      });
      if (Number(d.count) > 1) {
        toolTipNameDiv.text(`${getDisplayNameFromType(d.type)}s (${d.count})`);
      } else {
        toolTipNameDiv.text(`${getDisplayNameFromType(d.type)}`);
      }
    });

  const icon = squareG
    .append('svg')
    .attr('width', SINGLE_EVENT_LW)
    .attr('height', SINGLE_EVENT_LW)
    .style('cursor', 'pointer')
    .attr('viewBox', `0 0 35 35`)
    .attr('class', 'dg-icon')
    .attr('opacity', 1)
    .attr('y', (d) => yScale(d.keyIndex) ?? '0')
    .attr('x', (d) => xScale(d.timeset) + SINGLE_EVENT_LW / 2);

  icon
    .append('path')
    .attr('fill', 'white')
    .attr('transform', 'translate(3,3)')
    .attr('width', SINGLE_EVENT_LW)
    .attr('height', SINGLE_EVENT_LW)
    .attr('d', (d) => iconMap(d.type));

  squareG
    .selectAll('circle')
    .data(flatData)
    .enter()
    .append('circle')
    .attr('class', 'dg-circle')
    .attr('opacity', 1)
    .attr('fill', 'var(--zss-blue)')
    .attr('stroke', 'var(--zss-chart-bg)')
    .attr('stroke-width', 2)
    .attr('r', (d) => (d.count > 1 ? 10 : 0))
    .attr('cy', (d) => yScale(d.keyIndex) ?? '0')
    .attr('cx', (d) => xScale(d.timeset) + 56);

  squareG
    .selectAll('number-label')
    .data(flatData)
    .enter()
    .append('text')
    .text((d) => (d.count > 1 ? d.count : ''))
    .attr('fill', 'white')
    .attr('text-anchor', 'middle')
    .attr('stroke', 0)
    .attr('class', 'dg-number')
    .attr('opacity', 1)
    .attr('font-size', '13')
    .attr('font-weight', '600')
    .attr('y', (d) => `${(yScale(d.keyIndex) ?? 0) + 4.5}`)
    .attr('x', (d) => xScale(d.timeset) + 56);

  // selectAll('.dg-square, .dg-icon, .dg-circle, .dg-number')
  //   .transition()
  //   .duration(100)
  //   // .delay((d, i = 1) => 100 * (i / 1000))
  //   .attr('opacity', 1)
  //   .ease();

  selectAll('.dg-icon, .dg-square').on('click', function (d, e: any) {
    let a = document.createElement('a');
    a.target = '_blank';
    a.href = `/demand-genius/${e.events[0]?.id ?? '12345'}`;
    a.click();
  });
};

export function updateDgPastEventsChart(svgId, data) {
  svg.selectAll(`.chart-group--${svgId}`).remove();
  makeDGPastEventChart(svgId, data);
}
