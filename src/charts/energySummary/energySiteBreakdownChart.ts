import { makeXAxis, makeYAxis } from "./utils/makeAxis.js";

import {
  EnergySiteBreakdownResponse,
  EnergySiteChildDataItem,
  EnergySiteDataItem,
} from "../types/EnergySiteBreakdown.js";
import {
  axisLeft,
  axisTop,
  descending,
  max,
  scaleBand,
  scaleLinear,
  select,
  selectAll,
} from "d3";
import { getDatasets, getDataSum } from "./utils/dataTransform.js";

// CONSTANTS
var svg;
var chartG;

var xScale;
var yScale;

var xAxis;
var yAxis;

var barGroup;
var barChildren;

export function makeBreakdownChart(
  svgId,
  initData: EnergySiteBreakdownResponse,
) {
  const THRESHOLD = 80,
    ABOVE_THRESHOLD_COLOR = "var(--zss-warning)",
    BELOW_THRESHOLD_COLOR = "var(--zss-nominal)";

  const { flatData, groupData, jsonData } = getDatasets(initData);

  jsonData.sort((x, y) => descending(x.KwH, y.KwH));

  svg = select(`svg#${svgId}`);
  var margin = { top: 20, right: 20, bottom: 20, left: 20 },
    width = +svg.attr("width") - margin.left - margin.right,
    height = 80 * groupData.length - margin.top - margin.bottom + 100;
  //
  svg.attr("height", height);

  chartG = svg
    .append("g")
    .attr("class", `chart-group--${svgId}`)
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // var divTooltip = select("body")
  //   .append("div")
  //   .attr("class", `energy-breakdown-chart--tooltip--${svgId}`)
  //   .style("opacity", 0);

  chartG
    .append("rect")
    .attr("class", `${svgId}--background`)
    .attr("width", width)
    .attr("height", height - margin.bottom - margin.top)
    .attr("fill", "var(--zss-chart-bg)")
    .attr("transform", `translate(0, -${5})`)
    .attr("ry", 8);

  xScale = scaleLinear()
    .domain([0, max(groupData, (d) => Number(d.KwH) + 50) ?? 1500])
    .range([0, width])
    .nice();

  yScale = scaleBand()
    .domain(groupData.map((d) => d.SiteName))
    .range([0, height - margin.top - margin.top])
    .padding(0.53);

  // AXES
  xAxis = axisTop(xScale)
    .tickSize(height - margin.top - margin.bottom)
    .tickSizeOuter(0)
    .ticks(7);

  yAxis = axisLeft(yScale).tickSizeOuter(0).tickSizeInner(0);

  makeXAxis(chartG, xAxis, height - margin.top - margin.bottom);
  makeYAxis(chartG, yAxis);

  // barGroup = chartG
  //   .selectAll("rect.site-bar--group")
  //   .data(groupData)
  //   .enter()
  //   .append("g")
  //   .attr("class", "site-bar--group");

  barChildren = chartG
    .selectAll("rect.chart-child")
    .data(flatData)
    .enter()
    .append("rect")
    .attr("class", (d) => `${d.parentId} chart-child`)
    .attr("fill", (d) =>
      xScale(d.KwH) > xScale(THRESHOLD)
        ? ABOVE_THRESHOLD_COLOR
        : BELOW_THRESHOLD_COLOR,
    )
    .attr("rx", 3)
    .attr("stroke", "var(--zss-chart-bg)")
    .attr("stroke-width", "4")
    .attr("opacity", "0.8")
    .attr("x", (d, i) => {
      if (d.index == 0) {
        return xScale(0) + 5;
      }
      const allChildren = flatData.filter((ch) => ch.SiteName == d.SiteName);
      let offset = 0;
      allChildren.forEach((ch) => {
        if (ch.index < d.index) {
          offset += ch.KwH;
        }
      });
      return xScale(offset);
    })
    .attr("y", (d) => yScale(d.SiteName) ?? 0)
    .attr("height", yScale.bandwidth())
    .attr("data-id", (d) => d.ChildName)
    .attr("data-parentId", (d) => d.SiteName)
    .style("transition", "all 100ms ease");

  barChildren
    // .selectAll("rect.chart-child")
    .transition()
    .duration(500)
    .delay((d: EnergySiteDataItem) => d.index * 120)
    .attr("width", (d) => xScale(d.KwH))
    .ease();
  // grey bars
  // barGroup
  //   .append("g")
  //   .append("rect")
  //   .attr("y", (d) => yScale(d.SiteName) ?? 0)
  //   .attr("x", 5)
  //   .attr("rx", 3)
  //   .attr("id", (d) => d.id)
  //   .attr("class", "site-bar")
  //   .attr("width", 0)
  //   .attr("height", yScale.bandwidth())
  //   .attr("fill", "var(--zss-blue)")
  //   .attr("opacity", 0);

  // barGroup
  //   .selectAll(".site-bar")
  //   .transition()
  //   .duration(1000)
  //   .delay((d: EnergySiteDataItem) => d.index * 120)
  //   .attr("width", (d: EnergySiteDataItem) => xScale(getDataSum(d)))
  //   .ease();

  // ANIMATIONS
  // chartG
  //   .selectAll("rect.chart-child, rect.site-bar")
  //   .on("mouseover", function (e, d: EnergySiteChildDataItem) {
  //     divTooltip.transition().duration(500).style("opacity", 0.9);
  //     divTooltip
  //       .html(
  //         `
  //             <div>
  //             <strong> ${d.ChildName} </strong>
  //             <br/>
  //             <div>
  //               kwh: ${d.KwH}
  //             </div>
  //             </div>
  //           `,
  //       )
  //       .style("left", e.pageX + "px")
  //       .style("top", e.pageY + "px");

  //     selectAll(`.${d.parentId}`)
  //       .transition()
  //       .duration(50)
  //       .attr("opacity", "1")
  //       .attr("cursor", "pointer");
  //   })
  //   .on("mouseout", function (e, d: EnergySiteDataItem) {
  //     divTooltip.style("opacity", "0");
  //     selectAll(`.${d.parentId}`)
  //       .transition()
  //       .duration(50)
  //       .attr("opacity", "0.8");
  //   });
}

export function updateEnergySiteBreakdownChart(svgId, data) {
  // divTooltip.transition().duration(500).style("opacity", 0);
  svg.selectAll(`.chart-group--${svgId}`).remove();
  // select(`.energy-breakdown-chart--tooltip--${svgId}`).remove();
  makeBreakdownChart(svgId, data);
}
