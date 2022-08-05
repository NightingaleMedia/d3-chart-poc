import {
  timeFormat,
  select,
  max,
  scaleLinear,
  scaleTime,
  extent,
  axisBottom,
  axisRight,
  timeParse,
  timeDay,
  selectAll
} from "../../../_snowpack/pkg/d3.js";
const fakeData = {
  data: [
    {
      baseline: 95,
      usage: 27,
      time: "07-01-2022"
    },
    {
      baseline: 86,
      usage: 34,
      time: "07-02-2022"
    },
    {
      baseline: 75,
      usage: 38,
      time: "07-03-2022"
    },
    {
      baseline: 73,
      usage: 48,
      time: "07-04-2022"
    },
    {
      baseline: 71,
      usage: 52,
      time: "07-05-2022"
    },
    {
      baseline: 86,
      usage: 68,
      time: "07-06-2022"
    },
    {
      baseline: 88,
      usage: 82,
      time: "07-07-2022"
    },
    {
      baseline: 76,
      usage: 74,
      time: "07-08-2022"
    },
    {
      baseline: 72,
      usage: 62,
      time: "07-09-2022"
    },
    {
      baseline: 22,
      usage: 10,
      time: "07-10-2022"
    },
    {
      baseline: 54,
      usage: 38,
      time: "07-11-2022"
    },
    {
      baseline: 68,
      usage: 22,
      time: "07-12-2022"
    },
    {
      baseline: 77,
      usage: 21,
      time: "07-13-2022"
    },
    {
      baseline: 84,
      usage: 28,
      time: "07-14-2022"
    }
  ]
};
let SVG;
let CHART_G;
let x, y;
export const makeGreenEngagement = (svgId, responseData) => {
  SVG = select(`svg#${svgId}`);
  SVG.append("defs").append("pattern").attr("id", "hash4_4").attr("width", "8").attr("height", "8").attr("patternUnits", "userSpaceOnUse").attr("patternTransform", "rotate(45)").append("rect").attr("width", "4").attr("height", "8").attr("fill", "rgba(170,140,140)").attr("opacity", 1);
  const BAR_WIDTH = 55;
  const PAD = 20;
  const BAR_Y_OFFSET = 10;
  var margin = {top: 30, right: 10, bottom: 30, left: 10}, tooltipHeight = 0, tooltipWidth = Number(SVG.attr("width")) - margin.left - margin.right, width = +Number(SVG.attr("width")) - margin.left - margin.right, height = +Number(SVG.attr("height")) - margin.top - margin.bottom;
  SVG.style("cursor", "crosshair");
  CHART_G = SVG.append("g").attr("id", `green-engagement--${svgId}`).attr("transform", `translate(${margin.left}, 0)`);
  CHART_G.append("rect").attr("width", width).attr("height", height).attr("transform", `translate(5, ${margin.top})`).attr("fill", "var(--zss-chart-bg)").attr("ry", 7);
  const tooltipDiv = select(`#energy-summary--tooltip--${svgId}`).style("top", `${height + tooltipHeight}px`).style("left", "0").style("opacity", 0);
  const toolTipDateDiv = tooltipDiv.select("#energy-summary--tooltip__date");
  const toolTipUsageDiv = tooltipDiv.select("#energy-summary--tooltip__usage");
  const hourFormat = timeFormat("%-I%p");
  const parseTime = timeParse("%m-%d-%Y");
  const data = fakeData.data.map((d, i) => {
    const timeset = parseTime(d.time) || new Date();
    return {
      index: i,
      timeset,
      total: Math.random() * 100,
      dateNum: Date.parse(new Date(timeset)),
      ...d
    };
  });
  const dataXrange = extent(data, function(d) {
    return d.timeset;
  });
  const yMax = Math.ceil(max(data, (d) => d.baseline) ?? 0);
  const padY = yMax * 0.3;
  const aggregateYRange = [0, yMax + padY];
  x = scaleTime().domain(dataXrange).range([0, width - margin.left - margin.right - PAD - PAD]);
  y = scaleLinear().domain(aggregateYRange).range([0, -height]);
  const xAxis = (g, x2) => {
    g.attr("transform", `translate(${PAD + margin.left - 6}, ${height + margin.top + 10})`).call(axisBottom(x2).scale(x2).tickSize(5).ticks(10).tickFormat((d) => {
      const f = timeFormat("%-m/%d");
      return f(d);
    }));
    g.select(".domain").remove();
    g.selectAll(".tick text, .tick line").attr("font-size", "0.85rem").attr("fill", "white").style("text-align", "left").attr("stroke", "none");
    g.selectAll(".tick text").attr(`transform`, `rotate(-60)`);
  };
  const yAxis = (g, y2) => {
    g.attr("transform", `translate(${margin.left}, ${-margin.top + height})`).call(axisRight(y2).scale(y2).tickSize(-width + 70).ticks(5));
    g.selectAll(".tick line, .domain").attr("fill", "none").attr("stroke", "0");
    g.selectAll(".tick text, .tick line").attr("fill", "white");
    g.selectAll(".tick:first-of-type text").attr("fill", "none");
    g.selectAll(".tick text").attr("transform", "translate(-40,0)");
  };
  const granBarsG = CHART_G.append("g").attr("class", "granular-data-bars").attr("transform", `translate(0,${margin.top + margin.bottom})`);
  const hundredBars = granBarsG.selectAll("hundred-bar").data(data).enter().append("rect").attr("fill", "var(--zss-nominal)").attr("height", -y(yMax)).attr("width", (d) => {
    return (x(timeDay.offset(d.timeset)) - x(d.timeset)) * (BAR_WIDTH / 100);
  }).attr("y", y(yMax) + height - margin.bottom - margin.top - BAR_Y_OFFSET).attr("x", (d) => {
    let len = (x(timeDay.offset(d.timeset)) - x(d.timeset)) * (BAR_WIDTH / 100);
    len = x(d.timeset) - len / 2;
    return len + PAD * 2;
  }).on("mouseover", function(event, d) {
    select(this).attr("opacity", 0.8);
    selectAll(`#text-percent--${d.index}, #text-total--${d.index}`).attr("opacity", 1);
  }).on("mouseout", function(event, d) {
    select(this).attr("opacity", 1);
    selectAll(`#text-percent--${d.index}, #text-total--${d.index}`).attr("opacity", 0);
  });
  const greenNotCaptured = granBarsG.selectAll("granular-rect").data(data).enter().append("rect").attr("fill", "url(#hash4_4)");
  const totalText = granBarsG.selectAll("texts").data(data).enter().append("text").text((d) => {
    return `${Math.floor(d.total)} kwh`;
  }).attr("id", (d) => `text-total--${d.index}`).attr("class", `text-total--${svgId}`).attr("fill", "white").attr("height", (d) => {
    return -y(d.baseline);
  }).attr("y", 0).attr("x", (d) => {
    let len = (x(timeDay.offset(d.timeset)) - x(d.timeset)) * (BAR_WIDTH / 100);
    len = x(d.timeset) - len / 2;
    return len + PAD * 2 - 8;
  }).attr("opacity", 0);
  const text = granBarsG.selectAll("texts").data(data).enter().append("text").text((d) => {
    return `${Math.floor(d.usage / d.baseline * 100)}%`;
  }).attr("id", (d) => `text-percent--${d.index}`).attr("class", `text-percent--${svgId}`).attr("fill", "white").attr("height", (d) => {
    return -y(d.baseline);
  }).attr("y", (d) => y(d.baseline) + height - margin.bottom - BAR_Y_OFFSET - 7).attr("x", (d) => {
    let len = (x(timeDay.offset(d.timeset)) - x(d.timeset)) * (BAR_WIDTH / 100);
    len = x(d.timeset) - len / 2;
    return len + PAD * 2 - 2;
  }).attr("opacity", 0);
  greenNotCaptured.attr("height", (d) => {
    return -y(d.baseline);
  }).attr("opacity", 0).attr("x", (d) => {
    let len = (x(timeDay.offset(d.timeset)) - x(d.timeset)) * (BAR_WIDTH / 100);
    len = x(d.timeset) - len / 2;
    return len + PAD * 2 + 0.25;
  }).attr("y", (d) => y(d.baseline) + height - margin.bottom - BAR_Y_OFFSET).attr("width", (d) => {
    return (x(timeDay.offset(d.timeset)) - x(d.timeset)) * (BAR_WIDTH / 100) - 0.5;
  }).on("mouseover", function(event, d) {
    select(this).attr("opacity", 0.8);
    selectAll(`#text-percent--${d.index}, #text-total--${d.index}`).attr("opacity", 1);
  }).on("mouseout", function(event, d) {
    select(this).attr("opacity", 1);
    selectAll(`#text-percent--${d.index}, #text-total--${d.index}`).attr("opacity", 0);
  });
  greenNotCaptured.transition().duration(1e3).delay((d) => d.index * 100 + 100).attr("opacity", `1`);
  SVG.on("mouseout", function(event, d) {
    selectAll(`.text-percent--${svgId}, .text-total--${svgId}`).attr("opacity", 0);
  });
  const compareBar = granBarsG.selectAll("above-rect").data(data).enter().append("rect").attr("fill", "var(--zss-green)").attr("opacity", 0.9).attr("height", (d) => {
    return -y(d.usage);
  }).attr("x", (d) => {
    let len = (x(timeDay.offset(d.timeset)) - x(d.timeset)) * BAR_WIDTH / 100;
    len = x(d.timeset) - len / 2;
    return len + PAD * 2;
  }).attr("y", (d) => height - margin.top + y(d.usage) - BAR_Y_OFFSET).attr("width", (d) => {
    return (x(timeDay.offset(d.timeset)) - x(d.timeset)) * (BAR_WIDTH / 100);
  }).on("mouseover", function(event, d) {
    selectAll(`#text-percent--${d.index}, #text-total--${d.index}`).attr("opacity", 1);
  }).on("mouseout", function(event, d) {
    select(this).attr("opacity", 1);
    select(`#text-percent--${d.index}`).attr("opacity", 0);
  });
  CHART_G.append("g").call(xAxis, x);
  CHART_G.append("g").call(yAxis, y);
};
export const updateGreenEngagement = (svgId, data) => {
  console.log(`remove...`);
  select(`#green-engagement--${svgId}`).remove();
  makeGreenEngagement(svgId, data);
};
