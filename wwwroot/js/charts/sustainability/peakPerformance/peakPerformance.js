import {
  axisBottom,
  axisRight,
  curveNatural,
  extent,
  line,
  pointer,
  scaleLinear,
  scaleTime,
  select,
  timeFormat,
  timeParse
} from "../../../_snowpack/pkg/d3.js";
const fakeData = {
  data: [
    {
      d1: 10,
      d2: 27,
      time: "07-01-2022"
    },
    {
      d1: 25,
      d2: 34,
      time: "07-02-2022"
    },
    {
      d1: 25,
      d2: 38,
      time: "07-03-2022"
    },
    {
      d1: 34,
      d2: 48,
      time: "07-04-2022"
    },
    {
      d1: 56,
      d2: 52,
      time: "07-05-2022"
    },
    {
      d1: 71,
      d2: 68,
      time: "07-06-2022"
    },
    {
      d1: 88,
      d2: 82,
      time: "07-07-2022"
    },
    {
      d1: 84,
      d2: 74,
      time: "07-08-2022"
    },
    {
      d1: 83,
      d2: 62,
      time: "07-09-2022"
    },
    {
      d1: 82,
      d2: 51,
      time: "07-10-2022"
    },
    {
      d1: 75,
      d2: 38,
      time: "07-11-2022"
    },
    {
      d1: 74,
      d2: 22,
      time: "07-12-2022"
    },
    {
      d1: 51,
      d2: 21,
      time: "07-13-2022"
    },
    {
      d1: 39,
      d2: 28,
      time: "07-14-2022"
    }
  ]
};
let SVG;
let CHART_G;
export function makePeakPerformance(svgId, data) {
  SVG = select(`svg#${svgId}`);
  var Tooltip = select("body").append("div").style("opacity", 0).attr("class", "tooltip").attr("id", `tooltip--${svgId}`);
  var margin = {left: 20, top: 0, bottom: 20, right: 20};
  var width = SVG.attr("width") - margin.left - margin.right;
  var height = SVG.attr("height") - margin.top - margin.bottom;
  SVG.append("defs").append("clipPath").attr("id", "clip").append("rect").attr("width", width).attr("height", height);
  CHART_G = SVG.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("id", `chart-group--${svgId}--peak-performance`);
  const CHART_BG = CHART_G.append("rect").attr("fill", "var(--zss-chart-bg)").attr("ry", 7).attr("height", 0).attr("width", width + margin.left + margin.right).attr("transform", `translate(${-margin.left},0)`);
  const dateParser = timeParse("%m-%d-%Y");
  const makeData = (data2) => data2.map((d, index) => ({
    ...d,
    index,
    timeset: dateParser(d.time)
  }));
  const peakData = makeData(fakeData.data);
  const dataXrange = extent(peakData, (d) => d.timeset ?? new Date());
  const dataYrange = [0, 140];
  const xScale = scaleTime().domain(dataXrange).range([0, width]);
  const yScale = scaleLinear().domain(dataYrange).range([height, 0]);
  var xAxis = axisBottom(xScale).scale(xScale).ticks(0).tickFormat((d) => "");
  var yAxis = axisRight(yScale).scale(yScale).ticks(0).tickFormat((d) => d + "°").tickSizeOuter(1);
  CHART_G.append("g").attr("class", "x axis").attr("transform", `translate(0, ${height + 10})`).call(xAxis).call((g) => g.selectAll(".domain").remove());
  CHART_G.append("g").attr("class", "y axis right").call(yAxis).call((g) => g.selectAll(".domain").remove());
  const dataLine = line().curve(curveNatural).x((d) => xScale(d.timeset)).y((d) => yScale(d.d1));
  const compareLine = line().curve(curveNatural).x((d) => xScale(d.timeset)).y((d) => yScale(d.d2));
  CHART_G.append("path").datum(peakData).attr("d", compareLine).attr("fill", "none").attr("stroke-width", "6px").attr("stroke", "var(--zss-nominal)");
  CHART_G.append("path").datum(peakData.filter((d) => d.d1 != null)).attr("d", dataLine).attr("fill", "none").attr("stroke-width", "9px").attr("stroke", "var(--zss-green)");
  CHART_BG.transition().duration(1e3).attr("height", height + margin.top + margin.bottom);
  const tracerG = CHART_G.append("g").attr("transform", `translate(${margin.left},${-margin.top})`);
  const tracerLineY = tracerG.append("rect").attr("opacity", 0).attr("class", "single-event--track-line-y").attr("fill", "white").attr("height", height).attr("width", 0.5).attr("transform", `translate(${-margin.left}, ${margin.top + 7})`);
  const tracerLineX = tracerG.append("rect").attr("opacity", 0).attr("class", "single-event--track-line-y").attr("fill", "white").attr("height", 0.5).attr("width", width).attr("transform", `translate(${-margin.left}, 0)`);
  const tracerText = tracerG.append("text").attr("opacity", 0).attr("fill", "white").attr("text-anchor", "middle").attr("x", tracerLineY.attr("x")).attr("y", height + margin.bottom - 12);
  const formatTime = timeFormat("%_m/%d");
  CHART_G.append("rect").attr("width", width).attr("height", height).style("cursor", "none").attr("fill", "rgba(0,0,0,0)").on("mousemove", function(event) {
    tracerLineY.attr("x", pointer(event)[0]);
    tracerLineX.attr("y", pointer(event)[1]);
    tracerText.attr("x", pointer(event)[0] - 35).text(`${formatTime(xScale.invert(pointer(event)[0]))} | ${yScale.invert(pointer(event)[1]).toFixed(1)} kWh`);
  }).on("mouseover", () => {
    [tracerLineY, tracerLineX, tracerText].forEach((d) => d.attr("opacity", 1));
  }).on("mouseout", () => {
    [tracerLineY, tracerLineX, tracerText].forEach((d) => d.attr("opacity", 0));
  });
}
export const updatePeakPerformance = (svgId, data) => {
  SVG.select(`#chart-group--${svgId}--peak-performance`).remove();
  makePeakPerformance(svgId, data);
};
