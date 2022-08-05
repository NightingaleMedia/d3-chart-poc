import {
  select,
  max,
  scaleLinear,
  extent,
  axisBottom,
  axisRight,
  scaleBand,
  interpolateWarm,
  scaleQuantize
} from "../../../_snowpack/pkg/d3.js";
let SVG;
let CHART_G;
let x, y;
export const makeSiteEnergyUsage = (svgId, responseData) => {
  console.log({responseData});
  SVG = select(`svg#${svgId}`);
  const BAR_WIDTH = 50;
  const PAD = 15;
  const BAR_Y_OFFSET = 10;
  var margin = {top: 30, right: 10, bottom: 30, left: 30}, tooltipHeight = 0, tooltipWidth = Number(SVG.attr("width")) - margin.left - margin.right, width = +Number(SVG.attr("width")) - margin.left - margin.right, height = +Number(SVG.attr("height")) - margin.top - margin.bottom;
  SVG.style("cursor", "crosshair");
  CHART_G = SVG.append("g").attr("id", `green-engagement--${svgId}`).attr("transform", `translate(${margin.left}, 0)`);
  CHART_G.append("rect").attr("width", width).attr("height", height).attr("transform", `translate(5, ${margin.top})`).attr("fill", "var(--zss-chart-bg)").attr("ry", 7);
  const renderedData = responseData.reduce((arr, i) => {
    let falseArray = [];
    i.children.forEach((child) => falseArray.push(child));
    return [...falseArray, ...arr];
  }, []).sort((a, b) => b.title - a.title);
  const data = renderedData.map((d, i) => {
    return {
      index: i,
      ...d
    };
  });
  console.log({data});
  const yMax = Math.ceil(max(data, (d) => Number(d.KwH)) ?? 0);
  const padY = yMax * 0.4;
  const aggregateYRange = [0, yMax + padY];
  x = scaleBand().domain(data.map((d) => d.id)).range([0, width]).padding(0.5);
  y = scaleLinear().domain(aggregateYRange).range([0, -height]);
  const xAxis = (g, x2) => {
    g.attr("transform", `translate(${PAD + margin.left + 5}, ${height + margin.top})`).call(axisBottom(x2).scale(x2).tickSize(5).ticks(10).tickFormat((d) => d.title));
    g.select(".domain").remove();
    g.selectAll(".tick text, .tick line").attr("font-size", "0.85rem").attr("fill", "white").style("text-align", "left").attr("stroke", "none");
  };
  const yAxis = (g, y2) => {
    g.attr("transform", `translate(${-margin.left}, ${height + margin.top})`).call(axisRight(y2).scale(y2).tickSize(-width + 70).ticks(5));
    g.selectAll(".domain").remove();
    g.selectAll(".tick text").attr("fill", "white");
    g.selectAll(".tick line").attr("stroke", "var(--zss-chart-axis-line)").attr("stroke-width", 1).attr("transform", `translate(${width},0)`);
    g.selectAll(".tick:first-of-type text, .tick:first-of-type line, .tick:last-of-type text, .tick:last-of-type line").attr("fill", "none");
    g.selectAll(".tick text").attr("transform", "translate(0,0)");
  };
  const granBarsG = CHART_G.append("g").attr("class", "granular-data-bars").attr("transform", `translate(0,${margin.top + margin.bottom})`);
  const colorDomain = scaleQuantize().domain(extent(data.flatMap((d) => d.KwH))).range([
    "var(--zss-nominal)",
    "var(--zss-nominal)",
    "var(--zss-nominal)",
    "var(--zss-setpoint-line)",
    "var(--zss-warning)"
  ]);
  const getColor = (number) => interpolateWarm(colorDomain(number));
  const totalBars = granBarsG.selectAll("granular-rect").data(data).enter().append("rect").attr("class", `total-bars--${svgId}`).attr("id", (d) => `bar-total--${d.id}`).attr("x", (d) => x(d.id)).attr("y", (d) => y(d.KwH) + height - margin.bottom - BAR_Y_OFFSET).attr("width", x.bandwidth()).attr("height", (d) => -y(d.KwH)).attr("transform", `translate(0,${height})`).attr("fill", (d) => `${colorDomain(d.KwH)}`).attr("opacity", 0.85).attr("cursor", "pointer").on("mouseover", function(event, d) {
    select(this).attr("opacity", 1);
    SVG.selectAll(`#text-total--${d.id}, #text-name--${d.id}`).attr("opacity", 1);
  }).on("mouseout", function(event, d) {
    select(this).attr("opacity", 0.85);
    SVG.selectAll(`#text-total--${d.id}, #text-name--${d.id}`).attr("opacity", 0);
  }).on("click", (e, d) => {
    let a = document.createElement("a");
    a.target = "_blank";
    a.href = `/sites/${d.id ?? "12345"}`;
    a.click();
  });
  SVG.selectAll(`.total-bars--${svgId}`).transition().duration((d) => d.index * 100).delay((d) => d.index * 10).attr("transform", `translate(0,0)`);
  const totalTextG = granBarsG.selectAll("texts").data(data).enter().append("g").attr("transform", (d) => `translate(${x(d.id) + 14},0)`);
  const textName = totalTextG.append("text").text((d) => {
    return `${d.title}`;
  }).attr("text-anchor", "middle").attr("id", (d) => `text-name--${d.id}`).attr("class", `text--${svgId}`).attr("fill", "white").attr("opacity", 0);
  const textTotal = totalTextG.append("text").text((d) => `${d.KwH} kwh`).attr("text-anchor", "middle").attr("id", (d) => `text-total--${d.id}`).attr("class", `text--${svgId}`).attr("fill", "white").attr("opacity", 0).attr("y", 20);
  SVG.on("mouseout", function(event, d) {
    SVG.selectAll(`.text-total--${svgId}`).attr("opacity", 0);
  });
  CHART_G.append("g").call(xAxis, x);
  CHART_G.append("g").call(yAxis, y);
};
export const updateSiteEnergyUsage = (svgId, data) => {
  console.log(`remove...`);
  select(`#green-engagement--${svgId}`).remove();
  makeSiteEnergyUsage(svgId, data);
};
