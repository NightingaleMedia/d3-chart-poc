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
  utcFormat,
  sum,
  zoom,
  rollups,
  pointer
} from "../../_snowpack/pkg/d3.js";
import {
  getGranular,
  getXMonthTicks,
  getXTicks,
  getXWidth
} from "../../utils/chartUtils.js";
let IS_GRANULAR = false;
let SVG;
let CHART_G;
let x, y;
let THRESH_SLIDER;
export const generateEnergySummaryChart = (svgId, responseData, options) => {
  let THRESH_DAILY;
  let THRESH_HOURLY;
  let THRESH_TEXT;
  var WRAP = select(`div#${svgId}`);
  SVG = select(`svg#${svgId}`);
  THRESH_SLIDER = WRAP.select(`#${svgId}--slider`);
  var margin = {top: 30, right: 50, bottom: 30, left: 50}, tooltipHeight = 80, tooltipWidth = Number(SVG.attr("width")) - margin.left - margin.right, width = +SVG.attr("width") - margin.left - margin.right, height = +SVG.attr("height") - margin.top - margin.bottom - tooltipHeight;
  SVG.attr("viewBox", [0, 0, width, height]);
  SVG.style("cursor", "crosshair");
  CHART_G = SVG.append("g").attr("id", `energy-summary-chart--${svgId}`);
  CHART_G.append("rect").attr("width", width).attr("height", height + margin.top).attr("fill", "var(--zss-chart-bg)").attr("transform", `translate(0, -${margin.top + margin.bottom})`);
  const tooltipDiv = select(`#energy-summary--tooltip--${svgId}`).style("top", `${height + tooltipHeight}px`).style("left", "0").style("opacity", 0);
  const toolTipDateDiv = tooltipDiv.select("#energy-summary--tooltip__date");
  const toolTipUsageDiv = tooltipDiv.select("#energy-summary--tooltip__usage");
  const hourFormat = timeFormat("%-I%p");
  const jsonData = responseData.data;
  if (!jsonData || jsonData.length === 0) {
    return;
  }
  const parseTime = timeParse("%m-%d-%Y %H:%M");
  const parseDayOfYear = timeFormat("%j-%Y");
  const data = jsonData.map((d, i) => {
    const timeset = parseTime(d.time) || new Date();
    return {
      index: i,
      timeset: parseTime(d.time),
      dayOfYear: parseDayOfYear(timeset),
      dateNum: Date.parse(new Date(timeset)),
      ...d
    };
  });
  const aggregateData = rollups(data, (v) => sum(v, (d) => d.usage), (d) => d.dayOfYear).map(([day, usage], index) => {
    const parseTime2 = timeParse("%j-%Y");
    return {index, day, usage, timeset: parseTime2(day) || new Date()};
  });
  const dataXrange = extent(data, function(d) {
    return d.timeset;
  });
  const granularYRange = [0, max(data, (d) => d.usage)];
  const initYMax = Math.ceil(max(aggregateData, (d) => d.usage) ?? 0);
  const {threshold} = responseData;
  THRESH_DAILY = threshold.daily;
  THRESH_HOURLY = threshold.hourly;
  const aggregateYRange = [0, initYMax + initYMax / 4];
  THRESH_SLIDER.select(`input#${svgId}--slider-input`).remove();
  var INPUT = THRESH_SLIDER.append("input").attr("id", `${svgId}--slider-input`).attr("class", "mud-slider-input");
  INPUT.attr("type", "range").attr("min", 0).attr("max", initYMax).attr("value", THRESH_DAILY);
  function updateBarThresh() {
    if (IS_GRANULAR) {
      threshBar.attr("fill", "var(--zss-warning)").attr("height", (d) => {
        if (d.usage > THRESH_HOURLY) {
          return -y(d.usage) + y(THRESH_HOURLY);
        } else {
          return 0;
        }
      });
      THRESH_GROUP.attr("transform", `translate(0,${y(THRESH_HOURLY) + height - margin.bottom})`);
      INPUT.attr("max", granularYRange[1]).attr("value", THRESH_HOURLY);
      THRESH_TEXT.text(`Threshold: ${THRESH_HOURLY}kwh`);
    } else {
      bars.attr("fill", (d) => d.usage > THRESH_DAILY ? "var(--zss-warning)" : "var(--zss-nominal)");
      THRESH_GROUP.attr("transform", `translate(0 , ${y(THRESH_DAILY) + height - margin.bottom})`);
      INPUT.attr("max", initYMax).attr("value", THRESH_DAILY);
      THRESH_TEXT.text(`Threshold: ${THRESH_DAILY}kwh`);
    }
  }
  INPUT.on("input", function(e) {
    if (IS_GRANULAR) {
      THRESH_HOURLY = e.target.value;
    } else {
      THRESH_DAILY = e.target.value;
    }
    updateBarThresh();
  });
  x = scaleTime().domain([dataXrange[0] || new Date(), dataXrange[1] || new Date()]).range([0, width]).nice();
  y = scaleLinear().range([0, -height]).domain(aggregateYRange);
  const xAxis = (g, x2) => {
    const {isGranular, diff} = getGranular(x2);
    g.attr("transform", `translate(0, ${height - margin.bottom})`).call(axisBottom(x2).scale(x2).tickSize(5).ticks(getXTicks(diff, isGranular)).tickFormat((d) => {
      if (isGranular) {
        return hourFormat(d);
      }
      const f = timeFormat("%-m/%d");
      return f(d);
    }));
    g.selectAll(".tick text, .tick line").attr("fill", "white").style("text-align", "left").attr("stroke", "none");
  };
  const yAxis = (g, y2) => {
    g.attr("transform", `translate(${margin.left}, ${-margin.top + height})`).call(axisRight(y2).scale(y2).tickSize(-width + 70).ticks(5));
    g.selectAll(".tick line, .domain").attr("fill", "none").attr("stroke", "0");
    g.selectAll(".tick text, .tick line").attr("fill", "white");
    g.selectAll(".tick:first-of-type text").attr("fill", "none");
    g.selectAll(".tick text").attr("transform", "translate(-40,0)");
  };
  const x1MonthAxis = (g, x2) => {
    const {isGranular} = getGranular(x2);
    g.attr("class", "xMonthAxis").call(axisTop(x2).scale(x2).ticks(getXMonthTicks(isGranular)).tickFormat(isGranular ? utcFormat("%-m/%d") : utcFormat("%B %Y")).tickSize(-height - margin.bottom - margin.top + 80));
    g.selectAll(".tick line").attr("transform", `translate(${0}, ${-30})`).attr("stroke-width", 1).attr("stroke-opacity", 1).attr("stroke", "rgba(255,255,255,0.3)").style("font-size", "14px");
    g.selectAll(".tick text").attr("fill", "white").attr("opacity", "1").attr("text-anchor", "start").attr("transform", "translate(10,-10)").style("font-size", "1rem");
    g.selectAll(".domain").remove();
  };
  const barsG = CHART_G.append("g").attr("class", "rolled-data-bars");
  const bars = barsG.selectAll(".rolled-rect").data(aggregateData).enter().append("rect");
  const granBarsG = CHART_G.append("g").attr("class", "granular-data-bars");
  const granBars = granBarsG.selectAll("granular-rect").data(data).enter().append("rect").on("mouseover", function(event, d) {
    select(this).attr("opacity", 0.9);
    tooltipDiv.transition().duration(500).style("opacity", 1).style("left", `${pointer(event)[0] - 10}px`);
    toolTipDateDiv.text(() => hourFormat(d.timeset ?? new Date()));
    toolTipUsageDiv.text(`${d.usage} kwh`);
  }).on("mouseout", function(event, d) {
    select(this).attr("opacity", 1);
  });
  const threshBar = granBarsG.selectAll("above-rect").data(data).enter().append("rect");
  const mx = CHART_G.append("g").call(x1MonthAxis, x);
  const gx = CHART_G.append("g").call(xAxis, x);
  const gy = CHART_G.append("g").call(yAxis, y);
  const zoomHandler = zoom().scaleExtent([0.9, data.length / 20]).extent([
    [margin.left, 0],
    [width - margin.right, height]
  ]).translateExtent([
    [margin.left, -Infinity],
    [width - margin.right, Infinity]
  ]).on("zoom", zoomed);
  function zoomed(event) {
    const xz = event.transform.rescaleX(x);
    const {isGranular} = getGranular(xz);
    IS_GRANULAR = isGranular;
    if (isGranular) {
      bars.attr("fill", "none");
      granBars.attr("x", (d) => getXWidth(d, xz, "x", isGranular)).attr("y", (d) => y(d.usage) + height - margin.bottom).attr("width", (d) => getXWidth(d, xz, "width", isGranular)).attr("fill", "var(--zss-blue)").attr("height", (d) => -y(d.usage));
      threshBar.attr("width", (d) => getXWidth(d, xz, "width", isGranular)).attr("x", (d) => getXWidth(d, xz, "x", isGranular)).attr("y", (d) => y(d.usage) + height - margin.bottom);
    } else {
      threshBar.attr("fill", "none");
      granBars.attr("fill", "none");
      bars.attr("height", (d) => -y(d.usage)).attr("width", (d) => getXWidth(d, xz, "width", isGranular)).attr("y", (d) => y(d.usage) + height - margin.bottom).attr("x", (d) => getXWidth(d, xz, "x", isGranular));
    }
    y.domain(isGranular ? [0, (granularYRange[1] ?? 500) + (granularYRange[1] ?? 6 / 6)] : aggregateYRange);
    mx.call(x1MonthAxis, xz);
    gx.call(xAxis, xz);
    gy.call(yAxis, y);
    updateBarThresh();
  }
  SVG.call(zoomHandler).transition().delay(500).call(zoomHandler.scaleTo, 0);
  const THRESH_GROUP = CHART_G.append("g").attr("id", `${svgId}--threshold-group`).attr("transform", `translate(0 , ${y(THRESH_DAILY) + height - margin.bottom})`);
  const THRESH_LINE = THRESH_GROUP.append("rect").attr("width", width).attr("id", `${svgId}--threshold-line`).attr("fill", "var(--zss-chart-axis-line)").attr("height", "1").attr("y", -2).attr("x", 0);
  const THRESH_BG = THRESH_GROUP.append("rect").attr("height", "30px").attr("width", "180px").attr("y", -45).attr("x", width / 2 - 90).attr("fill", "var(--zss-blue)").attr("opacity", 0.7).attr("ry", 5);
  THRESH_TEXT = THRESH_GROUP.append("text").attr("id", `${svgId}--threshold-text`).attr("fill", "white").attr("x", width / 2 + 3).attr("y", -23).attr("style", "text-anchor: middle;");
  bars.on("mouseover", function(event, d) {
    const bar = select(this);
    bar.attr("opacity", 0.8);
    tooltipDiv.transition().duration(500).style("opacity", 1).style("left", `${bar.attr("x")}px`);
    toolTipDateDiv.text(() => {
      const f = timeFormat("%m/%d");
      return f(d.timeset ?? new Date());
    });
    toolTipUsageDiv.text(`${d.usage} kwh`);
  }).on("mouseout", function(event, d) {
    select(this).attr("opacity", 1);
  });
  bars.on("click", function(event, d) {
    SVG.call(zoomHandler).transition().duration(220).call(zoomHandler.scaleTo, 14).transition().duration(220).call(zoomHandler.translateTo, x(d.timeset), 0);
  });
};
export const updateEnergySummaryChart = (svgId, data) => {
  console.log(`remove...`);
  select(`#energy-summary-chart--${svgId}`).remove();
  generateEnergySummaryChart(svgId, data, {isUpdate: true});
};
