import {
  timeFormat,
  area,
  line,
  select,
  min,
  max,
  scaleLinear,
  scaleTime,
  scaleBand,
  extent,
  axisBottom,
  axisRight,
  axisLeft,
  timeParse,
  pointer,
  curveNatural,
  symbol,
  symbolDiamond,
  leastIndex,
  curveStep,
  curveCatmullRom
} from "../../../_snowpack/pkg/d3.js";
import singleEvent from "../../../data/dg-single-event.json.proxy.js";
import getColor, {ColorAccessor} from "./utils/getColor.js";
export function makeSingleDGChart(svgId, data) {
  var svg = select(`svg#${svgId}`), margin = {top: 30, right: 50, bottom: 30, left: 50}, legendHeight = 50, legendWidth = 728, width = +svg.attr("width") - margin.left - margin.right, height = +svg.attr("height") - margin.top - margin.bottom - legendHeight;
  const SHOW_FAN = false;
  const defs = svg.append("defs").append("clipPath").attr("id", "clip").append("rect").attr("width", width).attr("height", height);
  const chartG = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);
  const fullChart = chartG.append("g").attr("height", height).attr("width", width);
  fullChart.append("rect").attr("height", height + 0).attr("width", width - 20).attr("fill", "var(--zss-chart-bg)").attr("ry", 5).attr("transform", `translate(10, -0)`);
  const dateParser = timeParse("%I:%M %p");
  const dateFormat = timeFormat("%-I:%M %p");
  const xAccessor = (d) => {
    if (d) {
      const titleString = dateParser(d.Time);
      return titleString;
    } else
      return null;
  };
  const render = (jsonData) => {
    const data2 = jsonData.map((d, i) => ({
      index: i,
      timeset: dateParser(d.Time) ?? new Date(),
      ...d
    }));
    if (!data2 || data2.length < 1) {
      throw new console.error("Insufficient data");
    }
    let START_TIME_ENTRY = data2.find((d) => d.EventWindow == true);
    if (!START_TIME_ENTRY) {
      START_TIME_ENTRY = data2[0];
    }
    const END_TIME_ENTRY = data2.find((d) => {
      return d.index > (START_TIME_ENTRY?.index ?? 0) && d.EventWindow == false;
    });
    var dataXrange = extent(data2, (d) => d.timeset);
    const HighOutdoor = Number(max(data2.map((d) => d.OutdoorTemp)));
    const LowOutdoor = Number(min(data2.map((d) => d.OutdoorTemp)));
    const HighSet = Number(max(data2.map((d) => d.SetPoint)));
    const LowSet = Number(min(data2.map((d) => d.SetPoint)));
    const RangeHigh = max([HighOutdoor, HighSet]);
    const RangeLow = min([LowOutdoor, LowSet]);
    var tempRange = [
      Math.floor(Number(RangeLow) / 10) * 10,
      Math.ceil(Number(RangeHigh) / 10) * 10
    ];
    const kwhRange = [
      Math.floor(min(data2.map((d) => d.EnergyUsage)) / 50) * 50,
      Math.ceil(max(data2.map((d) => d.EnergyUsage)) / 100) * 100
    ];
    const xScale = scaleTime().domain([dataXrange[0] ?? new Date(), dataXrange[1] ?? new Date()]).range([0, width]).nice();
    const tempYScale = scaleLinear().range([height, 0]).domain(tempRange);
    const kwhYScale = scaleLinear().range([height, 0]).domain(kwhRange);
    const NUM_Y_LINES = 10;
    const fanScaleY = scaleLinear().domain([0, 3]).range([40, height / 3]);
    var xAxis = axisBottom(xScale).scale(xScale).tickSizeOuter(0).tickFormat((d) => dateFormat(d));
    var yRightAxis = axisRight(tempYScale).scale(tempYScale).ticks(NUM_Y_LINES).tickFormat((d) => d + "°").tickSizeOuter(1);
    var yLeftAxis = axisLeft(kwhYScale).scale(kwhYScale).tickFormat((d) => d + " kwh").ticks(NUM_Y_LINES).tickSize(-width + 40).tickSizeOuter(0);
    chartG.append("g").attr("class", "y axis right").call(yRightAxis).call((g) => g.selectAll(".tick text").attr("fill", getColor(ColorAccessor.AXIS_LABEL_COLOR))).call((g) => {
      g.selectAll(".tick line").attr("stroke", getColor(ColorAccessor.AXIS_COLOR));
      g.selectAll(".tick:first-of-type line, .tick:first-of-type text").attr("opacity", 0).attr("stroke", "white");
    }).attr("transform", `translate(${width},0)`);
    chartG.append("g").attr("class", "y axis left").call(yLeftAxis).call((g) => {
      g.selectAll(".tick line").attr("transform", "translate(20,0)").attr("stroke", getColor(ColorAccessor.AXIS_COLOR));
      g.selectAll(".tick:nth-of-type(odd) line").attr("opacity", 0);
      g.selectAll(".tick text").attr("fill", getColor(ColorAccessor.AXIS_LABEL_COLOR));
      g.selectAll(".tick:first-of-type line, .tick:first-of-type text, .tick:last-of-type line, .tick:last-of-type text").attr("opacity", 0);
    });
    chartG.append("g").attr("class", "x axis").attr("transform", `translate(0, ${height + 10})`).call(xAxis).call((g) => g.selectAll(".tick line, .tick text").attr("text-rendering", "optimizeLegibility").attr("fill", getColor(ColorAccessor.AXIS_LABEL_COLOR)));
    const startEnd = fullChart.append("rect").attr("class", "single-event--event-window").attr("fill", "rgba(105,105,135,0.2)").attr("height", height).attr("width", () => {
      const start = xScale(START_TIME_ENTRY?.timeset ?? new Date());
      const end = xScale(END_TIME_ENTRY?.timeset ?? new Date());
      return end - start;
    }).attr("x", xScale(START_TIME_ENTRY?.timeset ?? new Date())).attr("y", 0);
    const energyLine = line().curve(curveCatmullRom).x((d) => xScale(d.timeset)).y((d) => kwhYScale(d.EnergyUsage));
    const setpointLine = line().curve(curveStep).x((d) => xScale(d.timeset)).y((d) => tempYScale(d.SetPoint));
    const ambientTempLine = line().curve(curveNatural).x((d) => xScale(d.timeset)).y((d) => tempYScale(d.AmbientTemp));
    const outdoorTempLine = line().curve(curveNatural).x((d) => xScale(d.timeset)).y((d) => tempYScale(d.OutdoorTemp));
    const fanLine = line().curve(curveStep).x((d) => xScale(d.timeset)).y((d) => {
      return -fanScaleY(d.Fan);
    });
    var areaFunc = area().x((d) => d.timeset).y((d) => d.EnergyUsage);
    chartG.append("path").datum(data2).attr("d", areaFunc);
    if (SHOW_FAN) {
      chartG.append("path").datum(data2).attr("class", "single-event--fan-line").attr("d", fanLine).attr("stroke", getColor(ColorAccessor.FAN_COLOR)).attr("transform", `translate(0, ${height + 38})`);
    }
    chartG.append("path").datum(data2).attr("class", "single-event--fan-line").attr("d", outdoorTempLine).attr("stroke", getColor(ColorAccessor.OUTDOOR_TEMP_COLOR));
    chartG.append("path").datum(data2).attr("class", "single-event--energy-line").attr("d", energyLine).attr("stroke", getColor(ColorAccessor.ENERGY_LINE_COLOR)).attr("fill", "none");
    chartG.append("path").datum(data2).attr("class", "single-event--setpoint-line").attr("d", setpointLine).attr("stroke", getColor(ColorAccessor.SETPOINT_LINE_COLOR)).attr("fill", "none");
    chartG.append("path").datum(data2).attr("class", "single-event--ambient-temp-line").attr("d", ambientTempLine).attr("stroke", getColor(ColorAccessor.AMBIENT_TEMP_COLOR)).attr("stroke-width", 2).attr("fill", "none");
    const startEndLabels = fullChart.selectAll("g").data([null, "Start", "End"]).enter().append("g");
    startEndLabels.append("rect").attr("fill", "grey").attr("class", "start-end").attr("height", 30).attr("width", 55).attr("ry", 3).attr("x", (d, i) => {
      if (i === 1) {
        return xScale(START_TIME_ENTRY?.timeset ?? new Date()) - 25;
      } else {
        return xScale(END_TIME_ENTRY?.timeset ?? new Date()) - 25;
      }
    }).attr("y", kwhYScale(kwhRange[1] ?? 0 - 20) - 15);
    startEndLabels.append("text").attr("x", (d, i) => {
      if (i === 1) {
        return xScale(START_TIME_ENTRY?.timeset ?? new Date()) - 25;
      } else {
        return xScale(END_TIME_ENTRY?.timeset ?? new Date()) - 25;
      }
    }).attr("y", kwhYScale(kwhRange[1] ?? 0 - 20) - 15).style("text-anchor", "middle").attr("fill", "white").attr("dy", 20).attr("dx", 55 / 2).text(function(d) {
      return d;
    });
    var triangle = symbol().type(symbolDiamond).size(80);
    startEndLabels.append("path").attr("d", triangle).attr("fill", "grey").attr("class", "triangle").attr("transform", (d, i) => {
      const y = kwhYScale(kwhRange[1] ?? 0 - 20) + 15;
      let x;
      if (i === 1) {
        x = xScale(START_TIME_ENTRY?.timeset ?? new Date());
      } else {
        x = xScale(END_TIME_ENTRY?.timeset ?? new Date());
      }
      return `translate(${x}, ${y}) rotate(90)`;
    }).attr("x", (d, i) => {
      if (i === 1) {
        return xScale(START_TIME_ENTRY?.timeset ?? new Date()) - 25;
      } else {
        return xScale(END_TIME_ENTRY?.timeset ?? new Date()) - 25;
      }
    }).attr("y", kwhYScale(kwhRange[1] ?? 0 - 20));
    const legend = svg.selectAll("legendBox").data([1]).enter().append("g");
    const legendBox = legend.append("g").attr("x", 0).attr("y", height + legendHeight + 10);
    const LegendKeys = ["Usage", "Setpoint", "Ambient Temp", "Outdoor Temp"];
    if (SHOW_FAN) {
      LegendKeys.push("FAN");
    }
    const legendScale = scaleBand().domain(LegendKeys).range([0, legendWidth]);
    legendBox.append("rect").attr("fill", "rgba(50,50,50,0.6)").attr("ry", 6).attr("height", 34).attr("width", legendWidth).attr("y", Number(legendBox.attr("y")) + 15).attr("x", legendWidth / 4 + 55);
    const legendSection = legend.selectAll("labels").data(LegendKeys).enter().append("g").attr("x", legendWidth / 4).attr("width", legendScale.bandwidth());
    const colorLabels = legendSection.selectAll("labels").data(LegendKeys).enter().append("rect").attr("ry", 3).attr("fill", (d) => {
      return {
        Usage: getColor(ColorAccessor.ENERGY_LINE_COLOR),
        Setpoint: getColor(ColorAccessor.SETPOINT_LINE_COLOR),
        Fan: getColor(ColorAccessor.FAN_COLOR),
        "Ambient Temp": getColor(ColorAccessor.AMBIENT_TEMP_COLOR),
        "Outdoor Temp": getColor(ColorAccessor.OUTDOOR_TEMP_COLOR)
      }[d];
    }).attr("height", 20).attr("x", (d, i) => {
      const v = legendWidth / 4;
      return (legendScale(d) ?? 0) + v + 63;
    }).attr("y", () => {
      const val = Number(legendBox.attr("y"));
      return val + 22;
    }).attr("width", 20);
    const legendText = legendSection.selectAll("text").data(LegendKeys).enter().append("text").text((d) => d).attr("x", (d, i) => {
      const v = legendWidth / 4;
      return (legendScale(d) ?? 0) + v + 93;
    }).attr("y", () => {
      const val = Number(legendBox.attr("y"));
      return val + 38;
    }).attr("fill", "white");
    const updateLegendText = (datapoint) => {
      legendText.text((u) => {
        if (u == "Setpoint") {
          return `Setpoint:  ${datapoint["SetPoint"]}° F`;
        }
        if (u == "Usage") {
          return `Usage:  ${datapoint["EnergyUsage"]}KWH`;
        }
        if (u == "Fan") {
          return `Fan:  ${datapoint["Fan"]}`;
        }
        if (u == "Ambient Temp") {
          return `Indoor:  ${datapoint["AmbientTemp"]}° F`;
        }
        if (u == "Outdoor Temp") {
          return `Outdoor:  ${datapoint["OutdoorTemp"]}° F`;
        }
      });
    };
    const tracer = chartG.append("g");
    const tracerLineY = tracer.append("rect").attr("class", "single-event--track-line-y").attr("fill", "white").attr("height", height).attr("width", 0.4).attr("x", -100).attr("y", 0);
    const tracerLineX = tracer.append("rect").attr("class", "single-event--track-line-x").attr("height", 0.4).attr("fill", "white").attr("width", width).attr("y", -100);
    const tracerTextBg = tracer.append("rect").attr("fill", "var(--zss-blue)").attr("width", 75).attr("height", 35).attr("ry", 6).attr("text-anchor", "middle").attr("x", -width).attr("y", -10);
    const tracerText = tracer.append("text").attr("fill", "white").attr("text-anchor", "middle").attr("x", tracerLineY.attr("x")).attr("y", 13);
    chartG.append("rect").attr("width", width).attr("height", height).style("cursor", "crosshair").attr("fill", "rgba(0,0,0,0)").on("mousemove", function(event) {
      [tracerLineX, tracerLineY, tracerText, tracerTextBg].forEach((v) => v.attr("opacity", 1));
      const hoveredDate = xScale.invert(pointer(event)[0]);
      const getDistanceFromHoveredDate = (d) => Math.abs(xAccessor(d) - hoveredDate);
      const closestIndex = leastIndex(data2, (a, b) => {
        return getDistanceFromHoveredDate(a) - getDistanceFromHoveredDate(b);
      });
      const closestDataPoint = data2[closestIndex ?? 0];
      tracerLineX.attr("y", pointer(event)[1]);
      tracerLineY.attr("x", pointer(event)[0]);
      tracerText.attr("x", pointer(event)[0]).text(closestDataPoint?.Time ?? "N/A");
      tracerTextBg.attr("x", pointer(event)[0] - 38).text(closestDataPoint?.Time ?? "");
      updateLegendText(closestDataPoint);
      return;
    });
    chartG.on("mouseout", () => {
      [tracerLineX, tracerLineY, tracerText, tracerTextBg].forEach((v) => v.attr("opacity", 0));
    });
  };
  const theData = singleEvent;
  if (theData.length > 0) {
    render(theData);
  }
}
