import {
  timeFormat,
  select,
  max,
  scaleLinear,
  scaleTime,
  extent,
  axisBottom,
  axisRight,
  axisTop,
  timeParse,
  drag,
  utcFormat,
  sum,
  zoom,
  D3ZoomEvent,
  rollups,
  pointer,
} from "d3";

import {
  getGranular,
  getXMonthTicks,
  getXTicks,
  getXWidth,
} from "../../utils/chartUtils";
import energyUsage from "../../data/energySummary.json";
import {
  AggregateDataItem,
  EnergySummaryDataItem,
  EnergySummaryResponse,
  EnergySummaryTimeset,
} from "../types/EnergySummary";

let SVG;
let CHART_G;
let x, y;

export const generateEnergySummaryChart = (
  svgId: string,
  responseData: EnergySummaryResponse,
) => {
  SVG = select(`svg#${svgId}`);

  var margin = { top: 30, right: 50, bottom: 30, left: 50 },
    tooltipHeight = 80,
    tooltipWidth = Number(SVG.attr("width")) - margin.left - margin.right,
    width = +SVG.attr("width") - margin.left - margin.right,
    height = +SVG.attr("height") - margin.top - margin.bottom - tooltipHeight;

  SVG.attr("viewBox", [0, 0, width, height]);
  SVG.style("cursor", "crosshair");

  // https://stackoverflow.com/questions/38051889/d3-js-how-to-clip-area-outside-rectangle-while-zooming-in-a-grouped-bar-chart
  CHART_G = SVG.append("g").attr("class", `energy-summary-chart--${svgId}`);

  CHART_G.append("rect")
    .attr("width", width)
    .attr("height", height + margin.top)

    .attr("fill", "var(--zss-chart-bg)")
    .attr("transform", `translate(0, -${margin.top + margin.bottom})`);

  const tooltipDiv = select(`#energy-summary--tooltip--${svgId}`)
    .style("top", `${height + tooltipHeight}px`)
    .style("left", "0")
    .style("opacity", 0);

  const toolTipDateDiv = tooltipDiv.select("#energy-summary--tooltip__date");
  const toolTipUsageDiv = tooltipDiv.select("#energy-summary--tooltip__usage");

  const hourFormat = timeFormat("%-I%p");

  const jsonData: EnergySummaryTimeset[] = responseData.data;

  if (!jsonData || jsonData.length === 0) {
    return;
  }
  const { threshold } = responseData;

  const parseTime = timeParse("%m-%d-%Y %H:%M");
  const parseDayOfYear = timeFormat("%j-%Y");
  // Transform data
  const data: EnergySummaryDataItem[] = jsonData.map((d, i) => {
    const timeset = parseTime(d.time) || new Date();
    return {
      index: i,
      timeset: parseTime(d.time),
      dayOfYear: parseDayOfYear(timeset),
      dateNum: Date.parse(new Date(timeset) as any),
      ...d,
    };
  });

  // sums up granular data to daily
  const aggregateData: AggregateDataItem[] = rollups(
    data,
    (v) => sum(v, (d) => d.usage),
    (d) => d.dayOfYear,
  ).map(([day, usage], index) => {
    const parseTime = timeParse("%j-%Y");
    return { index, day, usage, timeset: parseTime(day) || new Date() };
  });

  const dataXrange = extent(data, function (d) {
    return d.timeset;
  });

  const granularYRange = [0, 80];

  const initYMax = Math.ceil(max(aggregateData, (d) => d.usage) ?? 0);

  const aggregateYRange = [0, initYMax + initYMax / 4 ?? 0];

  x = scaleTime()
    .domain([dataXrange[0] || new Date(), dataXrange[1] || new Date()])
    .range([0, width])
    .nice();

  y = scaleLinear().range([0, -height]).domain(aggregateYRange);

  const xAxis = (g, x) => {
    const { isGranular, diff } = getGranular(x);
    g.attr("transform", `translate(0, ${height - margin.bottom})`).call(
      axisBottom(x)
        .scale(x)
        .tickSize(5)
        .ticks(getXTicks(diff, isGranular))
        .tickFormat((d: Date) => {
          if (isGranular) {
            return hourFormat(d);
          }
          const f = timeFormat("%-m/%d");
          return f(d);
        }),
    );
    g.selectAll(".tick text, .tick line")
      .attr("fill", "white")
      .style("text-align", "left")
      .attr("stroke", "none");
  };
  const yAxis = (g, y) => {
    g.attr(
      "transform",
      `translate(${margin.left}, ${-margin.top + height})`,
    ).call(
      axisRight(y)
        .scale(y)
        .tickSize(-width + 70)
        .ticks(5),
    );
    g.selectAll(".tick line, .domain").attr("fill", "none").attr("stroke", "0");
    g.selectAll(".tick text, .tick line").attr("fill", "white");
    g.selectAll(".tick:first-of-type text").attr("fill", "none");
    g.selectAll(".tick text").attr("transform", "translate(-40,0)");
  };

  const x1MonthAxis = (g, x) => {
    const { isGranular } = getGranular(x);
    g.attr("class", "xMonthAxis").call(
      axisTop(x)
        .scale(x)
        .ticks(getXMonthTicks(isGranular))
        .tickFormat(isGranular ? utcFormat("%-m/%d") : utcFormat("%B %Y"))
        .tickSize(-height - margin.bottom - margin.top + 80),
    );

    g.selectAll(".tick line")
      .attr("transform", `translate(${0}, ${-30})`)
      .attr("stroke-width", 1)
      .attr("stroke-opacity", 1)
      .attr("stroke", "rgba(255,255,255,0.3)")
      .style("font-size", "14px");

    g.selectAll(".tick text")
      .attr("fill", "white")
      // .attr("stroke", "white")
      .attr("opacity", "1")
      .attr("text-anchor", "start")
      .attr("transform", "translate(10,-10)")
      .style("font-size", "1rem");

    g.selectAll(".domain").remove();
  };

  const barsG = CHART_G.append("g").attr("class", "data-bars");

  const bars = barsG
    .selectAll("rolled-rect")
    .data(aggregateData)
    .enter()
    .append("rect")

    .on(
      "mouseover",
      function (event, d: AggregateDataItem | EnergySummaryDataItem) {
        const bar = select(this);
        bar.attr("opacity", 0.8);
        tooltipDiv
          .transition()
          .duration(500)
          .style("opacity", 1)
          .style("left", `${bar.attr("x")}px`);

        toolTipDateDiv.text(() => {
          const f = timeFormat("%m/%d");
          return f(d.timeset ?? new Date());
        });

        toolTipUsageDiv.text(`${d.usage} kwh`);
      },
    )
    .on("mouseout", function (event, d) {
      select(this).attr("opacity", 1);
    });

  const granBarsG = CHART_G.append("g").attr("class", "granular-data-bars");

  const granBars = granBarsG
    .selectAll("granular-rect")
    .data(data)
    .enter()
    .append("rect")
    .on(
      "mouseover",
      function (event, d: AggregateDataItem | EnergySummaryDataItem) {
        select(this).attr("opacity", 0.9);
        tooltipDiv
          .transition()
          .duration(500)
          .style("opacity", 1)
          .style("left", `${pointer(event)[0] - 10}px`);

        toolTipDateDiv.text(() => hourFormat(d.timeset ?? new Date()));

        toolTipUsageDiv.text(`${d.usage} kwh`);
      },
    )
    .on("mouseout", function (event, d) {
      select(this).attr("opacity", 1);
    });

  const threshBar = granBarsG
    .selectAll("above-rect")
    .data(data)
    .enter()
    .append("rect");

  const mx = CHART_G.append("g").call(x1MonthAxis, x);
  const gx = CHART_G.append("g").call(xAxis, x);
  const gy = CHART_G.append("g").call(yAxis, y);

  const zoomHandler = zoom()
    .scaleExtent([0.9, data.length / 20])
    .extent([
      [margin.left, 0],
      [width - margin.right, height],
    ])
    .translateExtent([
      [margin.left, -Infinity],
      [width - margin.right, Infinity],
    ])
    .on("zoom", zoomed);

  function zoomed(
    event: D3ZoomEvent<any, EnergySummaryDataItem[] | AggregateDataItem[]>,
  ) {
    const xz = event.transform.rescaleX(x);
    // x.domain(xz.domain());
    const { isGranular } = getGranular(xz);
    if (isGranular) {
      // gy.call(yAxis, y);
      // svg.selectAll("rect").exit().remove(bars);
      bars.attr("fill", "none");
      granBars
        .attr("x", (d) => getXWidth(d, xz, "x", isGranular))
        .attr(
          "y",
          (d: EnergySummaryDataItem) => y(d.usage) + height - margin.bottom,
        )
        .attr("width", (d) => getXWidth(d, xz, "width", isGranular))
        .attr("fill", "var(--zss-blue)")
        .attr("height", (d: EnergySummaryDataItem) => -y(d.usage));

      threshBar
        .attr("fill", "var(--zss-warning)")
        .attr("height", (d) => {
          if (d.usage > threshold.hourly) {
            return -y(d.usage) + y(threshold.hourly);
          } else {
            return 0;
          }
        })
        .attr("width", (d) => getXWidth(d, xz, "width", isGranular))
        .attr("x", (d) => getXWidth(d, xz, "x", isGranular))
        .attr("y", (d) => y(d.usage) + height - margin.bottom);
    } else {
      // gy.call(yAxis, y);

      threshBar.attr("fill", "none");
      granBars.attr("fill", "none");
      bars
        .attr("height", (d) => -y(d.usage))
        .attr("width", (d) => getXWidth(d, xz, "width", isGranular))
        .attr("y", (d) => y(d.usage) + height - margin.bottom)
        .attr("x", (d) => getXWidth(d, xz, "x", isGranular))
        .attr("fill", (d) =>
          d.usage > threshold.daily
            ? "var(--zss-warning)"
            : "var(--zss-nominal)",
        );
      // .transition()
      // .delay((x, i) => i * 10)
      // .attr("opacity", 1);
    }
    y.domain(isGranular ? granularYRange : aggregateYRange);
    mx.call(x1MonthAxis, xz);
    gx.call(xAxis, xz);
    gy.call(yAxis, y);
  }

  SVG.call(zoomHandler)
    .transition()
    .delay(500)
    .call(zoomHandler.scaleTo as any, 4, [
      x(data[data.length - 1]?.timeset || new Date()),
      -1,
    ]);

  SVG.call(drag());
};

export const updateEnergySummaryChart = (svgId, data) => {
  SVG.selectAll(`.energy-summary-chart--${svgId}`).remove();
  generateEnergySummaryChart(svgId, data);
};
