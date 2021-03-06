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
  leastIndex,
  curveStep,
} from "d3";
import {
  DGEventDataPoint,
  DGEventDataPointItem,
} from "../../types/DGSingleEvent";

import getColor, { ColorAccessor } from "./utils/getColor";
import { transformData } from "./utils/transformData";
import { DeviceReportDataPointItem } from "../../types/DeviceReport";

export function generateDeviceDataReport(svgId, data) {
  var svg = select(`svg#${svgId}`),
    margin = { top: 30, right: 50, bottom: 30, left: 50 },
    legendHeight = 50,
    legendWidth = 728,
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom - legendHeight;

  const SHOW_FAN = false;
  svg
    .append("defs")
    .append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

  const chartG = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const fullChart = chartG
    .append("g")
    .attr("height", height)
    .attr("width", width);

  fullChart
    .append("rect")
    .attr("height", height)
    .attr("width", width)
    .attr("fill", "var(--zss-chart-bg)")
    .attr("ry", 5);

  // clipPath is used to keep line and area from moving outside of plot area when user zooms/scrolls/brushes

  const dateParser = timeParse("%_m/%e/%Y, %I:%M:%S %p");
  const dateFormat = timeFormat("%I:%M %p");

  const xAccessor = (d: DeviceReportDataPointItem): Date | null => {
    if (d) {
      const titleString = dateParser(new Date(d.timestamp).toLocaleString());
      return titleString;
    } else return null;
  };

  const constructedData = transformData(data[0]);

  const deviceData: DeviceReportDataPointItem[] = constructedData.data
    .sort((a, b) => a.timestamp - b.timestamp)
    .map((d, i) => ({
      index: i,
      timeset:
        dateParser(`${new Date(d.timestamp)?.toLocaleString()}`) ?? new Date(),
      ...d,
    }));

  var dataXrange = extent(deviceData, (d) => d.timeset);

  // Get the range depending on setpoint / ambient temp

  const HighOutdoor = Number(max(deviceData.map((d) => d.localTemperature)));
  const LowOutdoor = Number(min(deviceData.map((d) => d.localTemperature)));

  const HighSet = Number(max(deviceData.map((d) => d.coolingSetpoint)));
  const LowSet = Number(min(deviceData.map((d) => d.heatingSetpoint)));

  // const RangeHigh = HighAmb > HighSet ? HighAmb : HighSet;
  // const RangeLow = LowAmb < LowSet ? LowAmb : LowSet;

  const RangeHigh = max([HighOutdoor, HighSet]);
  const RangeLow = min([LowOutdoor, LowSet]);

  var tempRange = [
    Math.floor(Number(RangeLow) / 10) * 10,
    Math.ceil(Number(RangeHigh) / 10) * 10,
  ];

  const xScale = scaleTime()
    .domain([dataXrange[0] ?? new Date(), dataXrange[1] ?? new Date()])
    .range([0, width]);

  const tempYScale = scaleLinear().range([height, 0]).domain(tempRange);

  const NUM_Y_LINES = 10;
  const fanScaleY = scaleLinear()
    .domain([0, 10])
    .range([40, height / 3]);

  // AXES
  var xAxis = axisBottom(xScale)
    .scale(xScale)
    .tickSizeOuter(0)
    .ticks(15)
    .tickFormat((d: any) => dateFormat(d));

  var yRightAxis = axisRight(tempYScale)
    .scale(tempYScale)
    .ticks(NUM_Y_LINES)
    .tickFormat((d) => d + "??")
    .tickSizeOuter(1);

  // .attr("transform", `translate(${width},0)`);

  // KWH Line

  chartG
    .append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${height + 10})`)
    .call(xAxis)
    .call((g) =>
      g
        .selectAll(".tick line, .tick text")
        .attr("text-rendering", "optimizeLegibility")
        .attr("fill", getColor(ColorAccessor.AXIS_LABEL_COLOR)),
    );

  // COOLING SETPOINT LINE
  const coolingSetpointLine = line()
    .curve(curveStep)
    .x((d: any) => xScale(d.timeset))
    .y((d: any) => tempYScale(d.coolingSetpoint));

  // Ambient Temp Line
  const ambientTempLine = line()
    .curve(curveStep)
    .x((d: any) => xScale(d.timeset))
    .y((d: any) => tempYScale(d.localTemperature));

  // HEATING SETPOINT
  const heatingTempLine = line()
    .curve(curveStep)
    .x((d: any) => xScale(d.timeset))
    .y((d: any) => tempYScale(d.heatingSetpoint));

  // FANLINE
  const fanLine = line()
    .curve(curveStep)
    .x((d: any) => xScale(d.timeset))
    .y((d: any) => {
      return -fanScaleY(d.fanMode);
    });

  var areaFunc = area()
    .x((d: any) => d.timestamp)
    .y((d: any) => d.coolingSetpoint);

  chartG
    .append("path")
    .datum(deviceData)
    .attr("d", areaFunc as any);

  // FANLINE
  if (SHOW_FAN) {
    chartG
      .append("path")
      .datum(deviceData)
      .attr("class", "single-event--fan-line")
      .attr("d", fanLine as any)
      .attr("stroke", getColor(ColorAccessor.FAN_COLOR))
      .attr("transform", `translate(0, ${height + 38})`);
  }
  // OutdoorTemp
  chartG
    .append("path")
    .datum(deviceData)
    .attr("class", "single-event--setpoint-line")
    .attr("d", heatingTempLine as any)
    .attr("stroke", getColor(ColorAccessor.OUTDOOR_TEMP_COLOR));

  //   ENERGY LINE

  //   SET LINE
  chartG
    .append("path")
    .datum(deviceData)
    .attr("class", "single-event--setpoint-line")
    .attr("d", coolingSetpointLine as any)
    .attr("stroke", getColor(ColorAccessor.SETPOINT_LINE_COLOR))
    .attr("fill", "none");

  //   AMBIENT TEMP LINE
  chartG
    .append("path")
    .datum(deviceData)
    .attr("class", "single-event--ambient-temp-line")
    .attr("d", ambientTempLine as any)
    .attr("stroke", getColor(ColorAccessor.AMBIENT_TEMP_COLOR))
    .attr("stroke-width", 2)
    .attr("fill", "none");

  chartG
    .append("g")
    .attr("class", "y axis right")
    .call(yRightAxis)
    .call((g) =>
      g
        .selectAll(".tick text")
        .attr("fill", getColor(ColorAccessor.AXIS_LABEL_COLOR)),
    )
    .call((g) => {
      g.selectAll(".tick line").attr(
        "stroke",
        getColor(ColorAccessor.AXIS_COLOR),
      );
      g.selectAll(".tick:first-of-type line, .tick:first-of-type text")
        .attr("opacity", 0)
        .attr("stroke", "white");
    });

  const legend = svg.selectAll("legendBox").data([1]).enter().append("g");
  const legendBox = legend
    .append("g")
    .attr("x", 0)
    .attr("y", height + legendHeight + 10);

  const LegendKeys = ["Cooling Setpoint", "Heating Setpoint", "Ambient Temp"];
  if (SHOW_FAN) {
    LegendKeys.push("Fan");
  }
  const legendScale = scaleBand().domain(LegendKeys).range([0, legendWidth]);

  legendBox
    .append("rect")
    .attr("fill", "rgba(50,50,50,0.6)")
    .attr("ry", 6)
    .attr("height", 34)
    .attr("width", legendWidth)
    .attr("y", Number(legendBox.attr("y")) + 15)
    .attr("x", legendWidth / 4 + 55);

  const legendSection = legend
    .selectAll("labels")
    .data(LegendKeys)
    .enter()
    .append("g")
    .attr("x", legendWidth / 4)
    .attr("width", legendScale.bandwidth());

  const colorLabels = legendSection
    .selectAll("labels")
    .data(LegendKeys)
    .enter()
    .append("rect")
    .attr("ry", 3)
    .attr("fill", (d: string): any => {
      return {
        "Cooling Setpoint": getColor(ColorAccessor.SETPOINT_LINE_COLOR),
        Fan: getColor(ColorAccessor.FAN_COLOR),
        "Ambient Temp": getColor(ColorAccessor.AMBIENT_TEMP_COLOR),
        "Heating Setpoint": getColor(ColorAccessor.OUTDOOR_TEMP_COLOR),
      }[d];
    })
    .attr("height", 20)
    .attr("x", (d: string, i) => {
      const v = legendWidth / 4;
      return (legendScale(d) ?? 0) + v + 63;
    })
    .attr("y", () => {
      const val = Number(legendBox.attr("y"));
      return val + 22;
    })
    .attr("width", 20);

  const legendText = legendSection
    .selectAll("text")
    .data(LegendKeys)
    .enter()
    .append("text")
    .text((d: string) => d)
    .attr("x", (d: string, i) => {
      const v = legendWidth / 4;
      return (legendScale(d) ?? 0) + v + 93;
    })
    .attr("y", () => {
      const val = Number(legendBox.attr("y"));
      return val + 38;
    })
    .attr("fill", "white");

  const updateLegendText = (datapoint: DeviceReportDataPointItem) => {
    legendText.text((u: any): any => {
      if (u == "Cooling Setpoint") {
        return `C Setpoint:  ${datapoint.coolingSetpoint}?? F`;
      }
      if (u == "Heating Setpoint") {
        return `H Setpoint:  ${datapoint.heatingSetpoint}?? F`;
      }
      if (u == "Fan") {
        return `Fan:  ${datapoint.fanMode}`;
      }
      if (u == "Ambient Temp") {
        return `Indoor:  ${datapoint.localTemperature}?? F`;
      }
    });
  };

  const tracer = chartG.append("g");

  const tracerLineY = tracer
    .append("rect")
    .attr("class", "single-event--track-line-y")
    .attr("fill", "white")
    .attr("height", height)
    .attr("width", 0.4)
    .attr("x", -100)
    .attr("y", 0);

  const tracerLineX = tracer
    .append("rect")
    .attr("class", "single-event--track-line-x")
    .attr("height", 0.4)
    .attr("fill", "white")
    .attr("width", width)
    .attr("y", -100);

  const tracerTextBg = tracer
    .append("rect")
    .attr("fill", "var(--zss-blue)")
    .attr("width", 75)
    .attr("height", 35)
    .attr("ry", 6)
    .attr("text-anchor", "middle")
    .attr("x", -width)
    .attr("y", -10);

  const tracerText = tracer
    .append("text")
    .attr("fill", "white")
    .attr("text-anchor", "middle")
    .attr("x", tracerLineY.attr("x"))
    .attr("y", 13);

  chartG
    .append("rect")
    .attr("width", width)
    .attr("height", height)
    .style("cursor", "crosshair")
    .attr("fill", "rgba(0,0,0,0)")
    .on("mousemove", function (event) {
      const hoveredDate = xScale.invert(pointer(event)[0]) as any;

      const getDistanceFromHoveredDate = (d) =>
        Math.abs((xAccessor(d) as any) - hoveredDate);

      const closestIndex = leastIndex(deviceData, (a, b) => {
        return getDistanceFromHoveredDate(a) - getDistanceFromHoveredDate(b);
      });

      const closestDataPoint = deviceData[closestIndex ?? 0];

      // const closestXValue = dateFormat(d.timeset);
      tracerLineX.attr("y", pointer(event)[1]);
      tracerLineY.attr("x", pointer(event)[0]);

      tracerText
        .attr("x", pointer(event)[0])
        .text(dateFormat(closestDataPoint?.timeset ?? new Date()) ?? "N/A");
      tracerTextBg.attr("x", pointer(event)[0] - 38);

      updateLegendText(closestDataPoint as DeviceReportDataPointItem);
      return;
    });
}
//  csv(demandGenius).then((d) => render(d));

// tryAgain();
