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
  curveNatural
} from "../../_snowpack/pkg/d3.js";
import siteEvents from "../../data/energySiteBreakdown.json.proxy.js";
import _ from "../../_snowpack/pkg/lodash.js";
import {
  getGranular,
  getXMonthTicks,
  getXTicks,
  getXWidth
} from "../../utils/chartUtils.js";
import {makeLine} from "./makeLine.js";
export const generateEnergySiteComparisonChart = (svgId = "#energy-site-comparison", data) => {
  var svg = select(`svg#${svgId}`), margin = {top: 30, right: 50, bottom: 30, left: 50}, legendHeight = 80, tooltipWidth = Number(svg.attr("width")) - margin.left - margin.right, width = +svg.attr("width") - margin.left - margin.right, height = +svg.attr("height") - margin.top - margin.bottom - legendHeight;
  svg.attr("viewBox", [0, 0, width, height]);
  svg.style("cursor", "crosshair");
  const chartG = svg.append("g");
  chartG.append("rect").attr("width", width).attr("height", height + margin.top).attr("fill", "var(--zss-chart-bg)").attr("transform", `translate(0, -${margin.top + margin.bottom})`);
  const hourFormat = timeFormat("%-I%p");
  function render(jsonData) {
    const parseTime = timeParse("%m-%d-%Y %H:%M");
    const parseDayOfYear = timeFormat("%j-%Y");
    jsonData.forEach(function(d, i) {
      d.index = i;
      d.usage = d.usage.map((singleSite) => {
        const timeset = parseTime(singleSite.time) || new Date();
        if (isNaN(parseInt(singleSite.usage)))
          singleSite.usage = 0;
        const siteUsage = {
          usage: singleSite.usage,
          timeset,
          dayOfYear: parseDayOfYear(timeset),
          dateNum: Date.parse(new Date(timeset)),
          siteName: d.siteName
        };
        return siteUsage;
      });
    });
    const data2 = jsonData.reduce((arr, item) => {
      return [...arr, ...item.usage];
    }, []);
    const foundDataXRange = extent(data2, (d) => d.timeset);
    const dataXrange = [
      foundDataXRange[0] || new Date(),
      foundDataXRange[1] || new Date()
    ];
    const granularYRange = [
      0,
      Math.ceil(max(data2, (d) => d.usage) || 1100) + 10
    ];
    const aggregateYRange = [0, 1100];
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
      g.attr("transform", `translate(${margin.left}, ${-margin.top + height})`).call(axisRight(y2).scale(y2).tickSize(-width + 70).ticks(3));
      g.selectAll(".tick line, .domain").attr("fill", "none").attr("stroke", "0");
      g.selectAll(".tick text, .tick line").attr("fill", "var(--zss-chart-axis-text)");
      g.selectAll(".tick:first-of-type text").attr("fill", "none");
      g.selectAll(".tick text").attr("transform", "translate(-40,0)");
    };
    const x1MonthAxis = (g, x2) => {
      const {isGranular} = getGranular(x2);
      g.attr("class", "xMonthAxis").call(axisTop(x2).scale(x2).ticks(getXMonthTicks(isGranular)).tickFormat(isGranular ? utcFormat("%-m/%d") : utcFormat("%B %Y")).tickSize(-height - margin.bottom - margin.top + 80));
      g.selectAll(".tick line").attr("transform", `translate(${0}, ${-30})`).attr("stroke-width", 1).attr("stroke-opacity", 1).attr("stroke", " var(--zss-chart-axis-line)").style("font-size", "14px");
      g.selectAll(".tick text").attr("fill", "var(--zss-chart-axis-text)").attr("opacity", "1").attr("text-anchor", "start").attr("transform", "translate(10,-10)").style("font-size", "1rem");
      g.selectAll(".domain").remove();
    };
    const mx = chartG.append("g").call(x1MonthAxis, x);
    const gx = chartG.append("g").call(xAxis, x);
    const gy = svg.append("g").call(yAxis, y);
    const groupedData = group(data2, (d) => d.siteName);
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
          className
        });
        i++;
      });
    };
    const aggregateData = [];
    groupedData.forEach((data3) => {
      const value = rollups(data3, (v) => sum(v, (d) => d.usage), (d) => d.dayOfYear).map(([day, usage]) => {
        const parseTime2 = timeParse("%j-%Y");
        return {day, usage, timeset: parseTime2(day)};
      });
      aggregateData.push(value);
    });
    makeLines(groupedData, "granular-line");
    makeLines(aggregateData, "aggregate-line");
    const makeLegend = () => {
      let i = 0;
      groupedData.forEach((d, key) => {
        select(".site-comparison--legend").append("div").style("background-color", getColor(i)).style("padding", "1rem").style("color", "white").html(`
          <div style="text-align: center; min-width:80px;">
          <strong>${key}</strong><div id=${key}>0 kwh</div>
          </div>`);
        i++;
      });
    };
    makeLegend();
    const tracer = chartG.append("g");
    const tracerLineY = tracer.append("rect").attr("class", "single-event--track-line-y").attr("fill", "white").attr("height", height).attr("width", 0.4).attr("x", -100).attr("y", -40);
    const zoomFunc = zoom().scaleExtent([0.9, data2.length / 120]).extent([
      [margin.left, 0],
      [width - margin.right, height]
    ]).translateExtent([
      [margin.left, -Infinity],
      [width - margin.right, Infinity]
    ]).on("zoom", _.throttle(zoomed, 100, {leading: false}));
    function zoomed(event) {
      const xz = event.transform.rescaleX(x);
      const {isGranular} = getGranular(xz);
      mx.call(x1MonthAxis, xz);
      gx.call(xAxis, xz);
      gy.call(yAxis, y);
      y.domain(isGranular ? granularYRange : aggregateYRange);
      if (isGranular) {
        chartG.selectAll(".aggregate-line").attr("opacity", 0);
        chartG.selectAll(".granular-line").transition().attr("opacity", 1).attr("d", line().x((d) => getXWidth(d, xz, "x", isGranular)).y((d) => y(d.usage) + height - 30));
      } else {
        chartG.selectAll(".granular-line").attr("opacity", 0);
        chartG.selectAll(".aggregate-line").transition().attr("opacity", 1).attr("d", line().curve(curveNatural).x((d) => getXWidth(d, xz, "x", isGranular)).y((d) => y(d.usage) + height - 30));
      }
    }
    svg.call(zoomFunc).transition().duration(750).call(zoomFunc.scaleTo, 4, [
      x(data2[data2.length - 1]?.timeset || new Date()),
      0
    ]);
    svg.call(drag());
    chartG.append("rect").attr("width", width).attr("height", height).style("cursor", "crosshair").attr("fill", "rgba(0,0,0,0)").on("mousemove", function(event) {
      const hoveredDate = x.invert(pointer(event)[0]);
      tracerLineY.attr("x", pointer(event)[0]);
      return;
    });
  }
  setTimeout(() => {
    const dataToRender = siteEvents;
    render(dataToRender.data);
  }, 10);
};
