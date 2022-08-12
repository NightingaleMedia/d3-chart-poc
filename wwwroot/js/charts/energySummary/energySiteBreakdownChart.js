import {makeXAxis, makeYAxis} from "./utils/makeAxis.js";
import {
  axisLeft,
  axisTop,
  descending,
  max,
  pointer,
  scaleBand,
  scaleLinear,
  select,
  selectAll
} from "../../_snowpack/pkg/d3.js";
import {getDatasets} from "./utils/dataTransform.js";
var svg;
var chartG;
var xScale;
var yScale;
var xAxis;
var yAxis;
var barGroup;
var barChildren;
export function makeBreakdownChart(svgId, initData) {
  const THRESHOLD = initData.threshold ?? 80, ABOVE_THRESHOLD_COLOR = "var(--zss-warning)", BELOW_THRESHOLD_COLOR = "var(--zss-nominal)";
  const {flatData, groupData, jsonData} = getDatasets(initData);
  jsonData.sort((x, y) => descending(x.KwH, y.KwH));
  svg = select(`svg#${svgId}`);
  var margin = {top: 30, right: 0, bottom: 20, left: 0}, width = +svg.attr("width") - margin.left - margin.right, height = 90 * groupData.length - margin.top - margin.bottom + 90;
  svg.attr("height", height);
  chartG = svg.append("g").attr("id", `chart-group--${svgId}`).attr("transform", `translate(${margin.left}, ${margin.top})`);
  var divTooltip = select("body").append("div").attr("class", `energy-breakdown-chart--tooltip`).attr("id", `energy-breakdown-chart--tooltip--${svgId}`).style("opacity", 0);
  chartG.append("rect").attr("width", width).attr("height", height - margin.bottom - margin.top).attr("fill", "var(--zss-chart-bg)").attr("transform", `translate(0, -${5})`).attr("ry", 8);
  xScale = scaleLinear().domain([0, max(groupData, (d) => Number(d.KwH) + 50) ?? 1500]).range([0, width]).nice();
  yScale = scaleBand().domain(groupData.map((d) => d.title)).range([0, height - margin.top - margin.top]).padding(0.6);
  xAxis = axisTop(xScale).tickSize(height - margin.top - margin.bottom).tickSizeOuter(0).ticks(7).tickFormat((d) => `${d} kwh`);
  yAxis = axisLeft(yScale).tickSizeOuter(0).tickSizeInner(0);
  makeXAxis(chartG, xAxis, height - margin.top - margin.bottom);
  makeYAxis(chartG, yAxis);
  barChildren = chartG.selectAll("rect.chart-child").data(flatData).enter().append("rect").attr("class", (d) => `child-${d.parentId} chart-child`).attr("fill", (d) => xScale(d.KwH) > xScale(THRESHOLD) ? ABOVE_THRESHOLD_COLOR : BELOW_THRESHOLD_COLOR).attr("rx", 3).attr("stroke", "var(--zss-chart-bg)").attr("stroke-width", "0").attr("opacity", "0.8").attr("x", (d, i) => {
    if (d.index == 0) {
      return xScale(0) + 5;
    }
    const allChildren = flatData.filter((ch) => ch.title == d.title);
    let offset = 0;
    allChildren.forEach((ch, index) => {
      if (ch.index < d.index) {
        offset += ch.KwH + 5;
      }
    });
    return xScale(offset) + 5;
  }).attr("y", (d) => yScale(d.title) + 3).attr("height", yScale.bandwidth()).attr("data-id", (d) => d.ChildName).attr("data-parentId", (d) => d.title).style("transition", "all 100ms ease");
  barChildren.transition().duration(500).delay((d) => d.index * 120).attr("width", (d) => xScale(d.KwH)).ease();
  chartG.selectAll("rect.chart-child, rect.site-bar").on("mouseover", function(e, d) {
    divTooltip.transition().duration(500).style("opacity", 0.9);
    divTooltip.html(`
              <div>
              <strong>${d.ChildName}</strong>
              <br/>
              <div>
                Usage: ${d.KwH} kwh
              </div>
              </div>
            `).style("left", `${pointer(e)[0] - 10}px`).style("top", e.pageY + "px");
    selectAll(`.child-${d.parentId}`).transition().duration(50).attr("opacity", "1").attr("cursor", "pointer");
  }).on("mouseleave", function(e, d) {
    divTooltip.style("opacity", "0");
    selectAll(`.child-${d.parentId}`).attr("opacity", "0.8");
  });
  svg.on("mouseleave", function(e, d) {
    divTooltip.style("opacity", "0");
  });
}
export function updateEnergySiteBreakdownChart(svgId, data) {
  svg.selectAll(`#chart-group--${svgId}`).remove();
  makeBreakdownChart(svgId, data);
}
