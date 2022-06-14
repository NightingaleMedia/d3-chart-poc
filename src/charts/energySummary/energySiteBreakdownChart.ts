import { makeXAxis, makeYAxis } from "./makeAxis.js";
import { flattenData } from "./flattenEnergyData.js";
import energyChildren from "../../data/energyChildren.json";
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
  max,
  scaleBand,
  scaleLinear,
  select,
  selectAll,
} from "d3";
export function makeBreakdownChart(id = "#sigman-bar") {
  const THRESHOLD = 80,
    ABOVE_THRESHOLD_COLOR = "var(--zss-warning)",
    BELOW_THRESHOLD_COLOR = "var(--zss-green)";

  var svg = select(`svg${id}`),
    margin = { top: 40, right: 20, bottom: 40, left: 20 },
    width = +svg.attr("width") - margin.left - margin.right;

  // let height = 10000 - margin.top - margin.bottom;

  const chartG = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  var div = select("body")
    .append("div")
    .attr("class", "energy-breakdown-chart--tooltip")
    .style("opacity", 0);

  const render = (jsonData: EnergySiteChild[]) => {
    jsonData.sort((x, y) => descending(x.KwH, y.KwH));

    const data: EnergySiteDataItem[] = jsonData.map((d, i) => ({
      ...d,

      index: i,
    }));

    const flatData = flattenData(data);

    const height = 80 * data.length - margin.top - margin.bottom + 100;
    svg.attr("height", height);

    chartG
      .append("rect")
      .attr("width", width)
      .attr("height", height - margin.bottom - margin.top)
      .attr("fill", "var(--zss-chart-bg)")
      .attr("transform", `translate(0, -${0})`)
      .attr("ry", 8);

    const xScale = scaleLinear()
      .domain([0, max(data, (d) => Number(d.KwH) + 50) ?? 1500])
      .range([0, width])
      .nice();

    const yScale = scaleBand()
      .domain(data.map((d) => d.SiteName))
      .range([0, height - margin.top - margin.top])
      .padding(0.6);

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
      .data(data)
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
      .attr("opacity", 0)
      .attr("x", (d, i) => {
        if (d.index == 0) {
          return xScale(0);
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

    const greyBars = barGroup
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
      .attr("opacity", 1);

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
        div.transition().duration(500).style("opacity", 0.9);
        div
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
        div.style("opacity", 0);
        selectAll(`.${d.parentId}`)
          .transition()
          .duration(50)
          .attr("opacity", "0");
      });
  };

  const jsonData: EnergySiteBreakdownResponse = energyChildren;
  render(jsonData.data);
}
