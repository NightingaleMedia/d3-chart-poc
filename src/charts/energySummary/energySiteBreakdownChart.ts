import { makeXAxis, makeYAxis } from "./makeAxis.js";
import { flattenData } from "./utils/flattenEnergyData.js";
import {
  EnergySiteBreakdownResponse,
  EnergySiteChild,
  EnergySiteChildDataItem,
  EnergySiteDataItem,
} from "../types/EnergySiteBreakdown.js";
import {
  axisLeft,
  axisTop,
  descending,
  json,
  max,
  scaleBand,
  scaleLinear,
  select,
  selectAll,
} from "d3";
import { getDatasets } from "./utils/dataTransform.js";

// CONSTANTS
var svg;
var chartG;
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
  // let height = 10000 - margin.top - margin.bottom;

  chartG = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  var divTooltip = select("body")
    .append("div")
    .attr("class", "energy-breakdown-chart--tooltip")
    .style("opacity", 0);

  chartG
    .append("rect")
    .attr("class", `${svgId}--background`)
    .attr("width", width)
    .attr("height", height - margin.bottom - margin.top)
    .attr("fill", "var(--zss-chart-bg)")
    .attr("transform", `translate(0, -${0})`)
    .attr("ry", 8);

  const xScale = scaleLinear()
    .domain([0, max(groupData, (d) => Number(d.KwH) + 50) ?? 1500])
    .range([0, width])
    .nice();

  const yScale = scaleBand()
    .domain(groupData.map((d) => d.SiteName))
    .range([0, height - margin.top - margin.top])
    .padding(0.5);

  // AXES
  const xAxis = axisTop(xScale)
    .tickSize(height - margin.top - margin.bottom)
    .tickSizeOuter(0)
    .ticks(7);

  const yAxis = axisLeft(yScale).tickSizeOuter(0).tickSizeInner(0);

  makeXAxis(chartG, xAxis, height - margin.top - margin.bottom);
  makeYAxis(chartG, yAxis);

  const barGroup = chartG
    .selectAll("rect.site-bar--group")
    .data(groupData)
    .enter()
    .append("g")
    .attr("class", "site-bar--group");

  chartG
    .selectAll("rect.chart-child")
    .data(flatData)
    .enter()
    .append("rect")
    .attr("class", (d) => {
      console.log({ d });
      return `${d.parentId} chart-child`;
    })
    .attr("fill", (d) =>
      xScale(d.KwH) > xScale(THRESHOLD)
        ? ABOVE_THRESHOLD_COLOR
        : BELOW_THRESHOLD_COLOR,
    )
    .attr("rx", 3)
    .attr("stroke", "var(--zss-chart-bg)")
    .attr("stroke-width", "3")
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
    .attr("width", (d) => xScale(d.KwH))
    .style("transition", "all 100ms ease");

  // grey bars
  barGroup
    .append("g")
    .append("rect")
    .attr("y", (d) => yScale(d.SiteName) ?? 0)
    .attr("x", 5)
    .attr("rx", 3)
    .attr("id", (d) => d.id)
    .attr("class", "site-bar")
    .attr("width", 0)
    .attr("height", yScale.bandwidth())
    .attr("fill", "var(--zss-blue)")
    .attr("opacity", 0);

  barGroup
    .selectAll(".site-bar")
    .transition()
    .duration(1000)
    .delay((d: EnergySiteDataItem) => d.index * 120)
    .attr("width", (d: EnergySiteDataItem) => xScale(d.KwH))
    .ease();

  // ANIMATIONS
  chartG
    .selectAll("rect.chart-child, rect.site-bar")
    .on("mouseover", function (e, d: EnergySiteChildDataItem) {
      divTooltip.transition().duration(500).style("opacity", 0.9);
      divTooltip
        .html(
          `
              <div>
              <strong> ${d.ChildName} </strong>
              <br/> 
              <div>
                kwh: ${d.KwH} 
              </div>
              </div>
            `,
        )
        .style("left", e.pageX + "px")
        .style("top", e.pageY + "px");

      selectAll(`.${d.parentId}`)
        .transition()
        .duration(50)
        .attr("opacity", "1")
        .attr("cursor", "pointer");
    })
    .on("mouseout", function (e, d: EnergySiteDataItem) {
      divTooltip.style("opacity", "0");
      selectAll(`.${d.parentId}`)
        .transition()
        .duration(50)
        .attr("opacity", "0.8");
    });
}

export function updateEnergySiteBreakdownChart(data, svgId) {
  console.log("set fill red");
  chartG
    .select(`.${svgId}--background`)
    .transition()
    .duration(50)
    .attr("fill", "red");
}
// ** Update data section (Called from the onclick)
/*
function updateData(data) {
  // Get the data again

  // Scale the range of the data again
  x.domain(
    d3.extent(data, function (d) {
      return d.date;
    }),
  );
  y.domain([
    0,
    d3.max(data, function (d) {
      return d.close;
    }),
  ]);

  // Select the section we want to apply our changes to
  var svg = d3.select("body").transition();

  // Make the changes
  svg
    .select(".line") // change the line
    .duration(750)
    .attr("d", valueline(data));
  svg
    .select(".x.axis") // change the x axis
    .duration(750)
    .call(xAxis);
  svg
    .select(".y.axis") // change the y axis
    .duration(750)
    .call(yAxis);
}
*/
