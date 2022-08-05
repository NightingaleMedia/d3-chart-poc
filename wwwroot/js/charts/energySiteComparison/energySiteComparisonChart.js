import {
  timeFormat,
  line,
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
  pointer,
  utcFormat,
  interpolateWarm,
  group,
  rollups,
  sum,
  zoom,
  mode,
  curveLinear,
  format
} from "../../_snowpack/pkg/d3.js";
import _ from "../../_snowpack/pkg/lodash.js";
import {getXMonthTicks, getXWidth} from "../../utils/chartUtils.js";
import {getGranular, getXTicks} from "./utils/getGranular.js";
import {makeLine} from "./makeLine.js";
let xz;
export const generateEnergySiteComparisonChart = (svgId, renderData) => {
  const jsonData = renderData.data;
  var svg = select(`svg#${svgId}`), margin = {top: 30, right: 10, bottom: 30, left: 30}, legendHeight = 40, tooltipWidth = Number(svg.attr("width")) - margin.left - margin.right, width = +svg.attr("width") - margin.left - margin.right, height = +svg.attr("height") - margin.top - margin.bottom - legendHeight;
  svg.attr("viewBox", [0, 0, width, height]);
  svg.style("cursor", "crosshair");
  const chartG = svg.append("g").attr("id", `chart-group--${svgId}`);
  chartG.append("rect").attr("width", width).attr("height", height).attr("fill", "var(--zss-chart-bg)").attr("class", "energy-site-comparison-chart").attr("ry", 12).attr("transform", `translate(0, -${margin.bottom})`);
  const hourFormat = timeFormat("%-I%p");
  const parseTime = timeParse("%m-%d-%Y %H:%M");
  const parseDayOfYear = timeFormat("%j-%Y");
  const parseDayHourOfYear = timeFormat("%H-%j-%Y");
  const kwhFormat = format(",");
  jsonData.forEach(function(d, i) {
    d.index = i;
    d.data = d.energyData.map((singleSite) => {
      const timeset = parseTime(singleSite.time) || new Date();
      if (isNaN(parseInt(singleSite.usage)))
        singleSite.usage = 0;
      const siteUsage = {
        usage: singleSite.usage,
        timeset,
        dayOfYear: parseDayOfYear(timeset),
        dayHourOfYear: parseDayHourOfYear(timeset),
        dateNum: Date.parse(new Date(timeset)),
        siteName: d.title,
        id: d.id,
        parentId: d.parentId
      };
      return siteUsage;
    });
  });
  const data = jsonData.reduce((arr, item) => {
    return [...arr, ...item.data];
  }, []);
  const groupedData = group(data, (d) => d.siteName);
  const aggregateData = [];
  const flatData = [];
  if (!groupedData || groupedData.size == 0) {
    return;
  }
  groupedData.forEach((data2) => {
    data2.forEach((v) => flatData.push(v));
    const value = rollups(data2, (v) => sum(v, (d) => d.usage), (d) => d.dayOfYear).map(([day, usage]) => {
      const parseTime2 = timeParse("%j-%Y");
      return {day, usage, timeset: parseTime2(day)};
    });
    aggregateData.push(value);
  });
  const foundRange = [];
  aggregateData.forEach((d) => d.forEach((entry) => foundRange.push(entry?.usage ?? 0)));
  const foundDataXRange = extent(data, (d) => d.timeset);
  const dataXrange = [
    foundDataXRange[0] || new Date(),
    foundDataXRange[1] || new Date()
  ];
  const granularYRange = [
    0,
    Math.ceil(max(data, (d) => d.usage) ?? 0) + mode(data, (d) => d.usage)
  ];
  const aggregateYRange = [0, max(foundRange) + mode(foundRange)];
  const x = scaleTime().domain(dataXrange).range([0, width]).nice();
  const y = scaleLinear().range([0, -height]).domain(granularYRange);
  const xAxis = (g, x2) => {
    const {isGranular, diff} = getGranular(x2);
    g.attr("transform", `translate(0, ${height - margin.bottom})`).call(axisBottom(x2).scale(x2).tickSize(5).ticks(getXTicks(diff, isGranular)).tickFormat((d) => {
      if (isGranular) {
        return hourFormat(d);
      }
      const f = timeFormat("%-m/%d");
      return f(d);
    }));
    g.selectAll(".tick text, .tick line").attr("fill", "var(--zss-chart-axis-text)").style("text-align", "left").attr("stroke", "none");
  };
  const yAxis = (g, y2) => {
    g.attr("transform", `translate(0, ${-margin.top + height})`).call(axisRight(y2).scale(y2).tickSize(7).ticks(8).tickSizeOuter(0));
    g.selectAll(".domain").remove();
    g.selectAll(".tick line").attr("stroke", "white").attr("transform", "translate(40,0)");
    g.selectAll(".tick text, .tick line").attr("fill", "var(--zss-chart-axis-text)");
    g.selectAll(".tick:first-of-type text, .tick:last-of-type text, .tick:first-of-type line, .tick:last-of-type line").attr("fill", "none").attr("stroke", "none");
    g.selectAll(".tick text").attr("transform", "translate(0,0)");
  };
  const x1MonthAxis = (g, x2) => {
    const {isGranular} = getGranular(x2);
    g.attr("class", "xMonthAxis").call(axisTop(x2).scale(x2).ticks(getXMonthTicks(isGranular)).tickFormat(isGranular ? utcFormat("%-m/%d") : utcFormat("%B %Y")).tickSize(-height - margin.bottom - margin.top + 80));
    g.selectAll(".tick line").attr("transform", `translate(${0}, ${-20})`).attr("stroke-width", 1).attr("stroke-opacity", 1).attr("stroke", " var(--zss-chart-axis-line)").style("font-size", "14px");
    g.selectAll(".tick text").attr("fill", "var(--zss-chart-axis-text)").attr("opacity", "1").attr("text-anchor", "start").attr("transform", "translate(10,0)").style("font-size", "1.15rem");
    g.selectAll(".domain").remove();
  };
  const mx = chartG.append("g").call(x1MonthAxis, x);
  const gx = chartG.append("g").call(xAxis, x);
  const gy = svg.append("g").call(yAxis, y);
  const colorDomain = scaleLinear().domain([0, groupedData.size]).range([0, 1]);
  const getColor = (number) => interpolateWarm(colorDomain(number));
  const makeLines = (lineData, className) => {
    let i = 0;
    lineData.forEach((d) => {
      makeLine({
        data: d,
        xScale: x,
        y,
        color: getColor(i),
        selector: chartG,
        className,
        id: d[0].id,
        groupId: `clip-group-${svgId}`
      });
      i++;
    });
  };
  makeLines(groupedData, "granular-line");
  makeLines(aggregateData, "aggregate-line");
  const makeLegend = () => {
    let i = 0;
    jsonData.forEach((d, key) => {
      select(".site-comparison--legend").append("div").attr("id", d.id).style("background-color", getColor(key)).html(`
          <div style="text-align: center; min-width:100px; padding: 1rem; color: white;">
          <strong>${d.title}</strong><div id="kwh-${d.id}--value">${Math.ceil(d.KwH)} kwh</div>
          </div>`);
      i++;
    });
  };
  makeLegend();
  const tracerG = chartG.append("g");
  const tracerLineY = tracerG.append("rect").attr("class", "single-event--track-line-y").attr("fill", "white").attr("height", height).attr("width", 0.5).attr("x", -100).attr("y", -30);
  const tracerLineX = tracerG.append("rect").attr("class", "single-event--track-line-y").attr("fill", "white").attr("height", 0.5).attr("width", width).attr("transform", `translate(${margin.left},${-margin.top})`).attr("x", 0).attr("y", -30);
  const tracerTextBg = tracerG.append("rect").attr("fill", "var(--zss-blue)").attr("width", 95).attr("height", 35).attr("ry", 6).attr("text-anchor", "middle").attr("x", -width).attr("y", -legendHeight + margin.top + height + 10);
  const tracerText = tracerG.append("text").attr("fill", "white").attr("text-anchor", "middle").attr("x", tracerLineY.attr("x")).attr("y", -legendHeight + margin.top + height + 32);
  const zoomFunc = zoom().scaleExtent([1, data.length / 30]).extent([
    [margin.left, 0],
    [width - margin.right, height]
  ]).translateExtent([
    [margin.left, -Infinity],
    [width - margin.right, Infinity]
  ]).on("zoom", _.throttle(zoomed, 100, {leading: false}));
  function zoomed(event) {
    xz = event.transform.rescaleX(x);
    const {isGranular} = getGranular(xz);
    mx.call(x1MonthAxis, xz);
    gx.call(xAxis, xz);
    gy.call(yAxis, y);
    y.domain(isGranular ? granularYRange : aggregateYRange);
    if (isGranular) {
      chartG.selectAll(".aggregate-line").attr("opacity", 0);
      chartG.selectAll(".granular-line").transition().attr("opacity", 1).attr("d", line().curve(curveLinear).x((d) => getXWidth(d, xz, "x", isGranular)).y((d) => y(d.usage) + height - 30));
    } else {
      chartG.selectAll(".granular-line").attr("opacity", 0);
      chartG.selectAll(".aggregate-line").transition().attr("opacity", 1).attr("d", line().curve(curveLinear).x((d) => getXWidth(d, xz, "x", isGranular)).y((d) => y(d.usage) + height - 30));
    }
  }
  svg.call(zoomFunc).transition().duration(750).call(zoomFunc.scaleTo, 4, [
    x(data[data.length - 1]?.timeset || new Date()),
    0
  ]);
  svg.call(drag());
  function updateLegend(sites) {
    sites.forEach((d) => {
      select(`#kwh-${d.id}--value`).html(`${d.usage} kwh`);
    });
  }
  chartG.append("rect").attr("width", width).attr("height", height).style("cursor", "crosshair").attr("fill", "rgba(0,0,0,0)").on("mousemove", function(event) {
    tracerLineY.attr("x", pointer(event)[0]);
    tracerLineX.attr("y", pointer(event)[1] + 30);
    const value = Math.floor(y.invert(pointer(event)[1] - height + margin.bottom));
    tracerText.attr("x", pointer(event)[0]).text(`${kwhFormat(value)} kwh`);
    tracerTextBg.attr("x", pointer(event)[0] - 48);
    if (xz) {
      const hoveredDate = parseDayHourOfYear(xz.invert(pointer(event)[0]));
      updateLegend(flatData.filter((d) => d.dayHourOfYear == hoveredDate));
    }
  }).on("mouseover", () => {
    [tracerLineY, tracerLineX, tracerText, tracerTextBg].forEach((d) => d.attr("opacity", 1));
  }).on("mouseout", () => {
    [tracerLineY, tracerLineX, tracerText, tracerTextBg].forEach((d) => d.attr("opacity", 0));
  });
};
