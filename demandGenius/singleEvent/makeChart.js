import demandGenius from "../../data/demand-genius.csv";
export function dgChart() {
  var svg = d3.select("svg.demand-genius"),
    margin = { top: 30, right: 50, bottom: 30, left: 50 },
    legendHeight = 50,
    legendWidth = 660,
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom - legendHeight;

  const defs = svg
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
    .attr("height", height + 0)
    .attr("width", width - 20)
    .attr("fill", "var(--zen-chart-bg)")
    .attr("ry", 5)
    .attr("transform", `translate(10, -0)`);
  // clipPath is used to keep line and area from moving outside of plot area when user zooms/scrolls/brushes

  const ENERGY_LINE_COLOR = "#38feaf";
  const AMBIENT_TEMP_COLOR = "tomato";
  const SETPOINT_LINE_COLOR = "#fecc38";
  const FAN_COLOR = "var(--zen-blue)";
  const AXIS_COLOR = "rgba(255,255,255,0.1)";
  const AXIS_LABEL_COLOR = "white";

  const dateParser = d3.timeParse("%I:%M %p");
  const dateFormat = d3.timeFormat("%-I:%M %p");
  const xAccessor = (d) => {
    if (d) {
      const titleString = dateParser(d.Time);
      return titleString;
    }
  };

  const render = (data) => {
    // format month as a date
    data.forEach(function (d, i) {
      d.index = i;
      d.EventWindow = d.EventWindow.toLowerCase() == "true" ? true : false;

      d.timeset = dateParser(d.Time);
    });

    const START_TIME_ENTRY = data.find((d) => {
      return d.EventWindow == true;
    });

    const END_TIME_ENTRY = data.find((d) => {
      return d.index > START_TIME_ENTRY.index && d.EventWindow == false;
    });

    var dataXrange = d3.extent(data, function (d) {
      return d.timeset;
    });

    // Get the range depending on setpoint / ambient temp

    const HighAmb = Number(d3.max(data.map((d) => d.AmbientTemp)));
    const LowAmb = Number(d3.min(data.map((d) => d.AmbientTemp)));

    const HighSet = Number(d3.max(data.map((d) => d.SetPoint)));
    const LowSet = Number(d3.min(data.map((d) => d.SetPoint)));

    // const RangeHigh = HighAmb > HighSet ? HighAmb : HighSet;
    // const RangeLow = LowAmb < LowSet ? LowAmb : LowSet;

    const RangeHigh = d3.max([HighAmb, HighSet]);
    const RangeLow = d3.min([LowAmb, LowSet]);

    var tempRange = [
      Math.floor(Number(RangeLow) / 10) * 10,
      Math.ceil(Number(RangeHigh) / 10) * 10,
    ];

    const kwhRange = [
      d3.min(data.map((d) => d.EnergyUsage)),
      d3.max(data.map((d) => d.EnergyUsage)),
    ];

    const xScale = d3.scaleTime().domain(dataXrange).range([0, width]).nice();
    const tempYScale = d3.scaleLinear().range([height, 0]).domain(tempRange);
    const kwhYScale = d3.scaleLinear().range([height, 0]).domain(kwhRange);

    const NUM_Y_LINES = 10;
    const fanScaleY = d3
      .scaleLinear()
      .domain([0, 3])
      .range([40, height / 3]);

    // AXES
    var xAxis = d3
      .axisBottom()
      .scale(xScale)
      .tickSizeOuter(0)
      .tickFormat((d) => dateFormat(d));

    var yRightAxis = d3
      .axisRight()
      .scale(tempYScale)
      .ticks(NUM_Y_LINES)
      .tickFormat((d) => d + "°")
      .tickSizeOuter(1);

    var yLeftAxis = d3
      .axisLeft()
      .scale(kwhYScale)
      .tickFormat((d) => d + " kwh")
      .ticks(NUM_Y_LINES)
      .tickSize(-width + 40)
      .tickSizeOuter(0);

    chartG
      .append("g")
      .attr("class", "y axis right")
      .call(yRightAxis)
      .call((g) => g.selectAll(".tick text").attr("fill", AXIS_LABEL_COLOR))
      .call((g) => {
        g.selectAll(".tick line").attr("stroke", AXIS_COLOR);
        g.selectAll(".tick:first-of-type line, .tick:first-of-type text")

          .attr("opacity", 0)
          .attr("stroke", "white");
      })
      .attr("transform", `translate(${width},0)`);

    // KWH Line
    chartG
      .append("g")
      .attr("class", "y axis left")
      .call(yLeftAxis)
      .call((g) => {
        g.selectAll(".tick line")
          .attr("transform", "translate(20,0)")
          .attr("stroke", AXIS_COLOR);
        g.selectAll(".tick:nth-of-type(odd) line").attr("opacity", 0);
        g.selectAll(".tick text").attr("fill", AXIS_LABEL_COLOR);
        g.selectAll(".tick:first-of-type line, .tick:first-of-type text").attr(
          "opacity",
          0,
        );
      });

    chartG
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${height + 10})`)
      .call(xAxis)
      .call((g) =>
        g
          .selectAll(".tick line, .tick text")
          .attr("text-rendering", "optimizeLegibility")
          .attr("fill", AXIS_LABEL_COLOR),
      );

    // START END
    const startEnd = fullChart
      .append("rect")
      .attr("class", "single-event--event-window")
      .attr("fill", "rgba(105,105,135,0.2)")
      .attr("height", height)
      .attr("width", () => {
        const start = xScale(START_TIME_ENTRY.timeset);
        const end = xScale(END_TIME_ENTRY.timeset);
        return end - start;
      })
      .attr("x", xScale(START_TIME_ENTRY.timeset))
      .attr("y", 0);

    // ENERGY LINE
    const energyLine = d3
      .line()
      .curve(d3.curveNatural)
      .x((d) => xScale(d.timeset))
      .y((d) => kwhYScale(d.EnergyUsage));

    // SETPOINT LINE
    const setpointLine = d3
      .line()
      .curve(d3.curveNatural)
      .x((d) => xScale(d.timeset))
      .y((d) => tempYScale(d.SetPoint));

    const ambientTempLine = d3
      .line()
      .curve(d3.curveNatural)
      .x((d) => xScale(d.timeset))
      .y((d) => tempYScale(d.AmbientTemp));

    // FANLINE
    const fanLine = d3
      .line()
      .curve(d3.curveStep)
      .x((d) => xScale(d.timeset))
      .y((d) => {
        return -fanScaleY(d.Fan);
      });

    var area = d3
      .area()
      .x((d) => d.timeset)
      .y((d) => d.EnergyUsage);

    chartG.append("path").datum(data).attr("d", area);

    // FANLINE
    chartG
      .append("path")
      .datum(data)
      .attr("class", "single-event--fan-line")
      .attr("d", fanLine)
      .attr("stroke", FAN_COLOR)
      .attr("transform", `translate(0, ${height + 38})`);

    //   ENERGY LINE
    chartG
      .append("path")
      .datum(data)
      .attr("class", "single-event--energy-line")
      .attr("d", energyLine)
      .attr("stroke", ENERGY_LINE_COLOR)
      .attr("fill", "none");

    //   SET LINE
    chartG
      .append("path")
      .datum(data)
      .attr("class", "single-event--setpoint-line")
      .attr("d", setpointLine)
      .attr("stroke", SETPOINT_LINE_COLOR)
      .attr("fill", "none");

    //   AMBIENT TEMP LINE
    chartG
      .append("path")
      .datum(data)
      .attr("class", "single-event--ambient-temp-line")
      .attr("d", ambientTempLine)
      .attr("stroke", AMBIENT_TEMP_COLOR)
      .attr("stroke-width", 2)
      .attr("fill", "none");

    const startEndLabels = fullChart
      .selectAll("g")
      .data([null, "Start", "End"])
      .enter()
      .append("g");

    startEndLabels
      .append("rect")
      .attr("fill", "grey")
      .attr("class", "start-end")
      .attr("height", 30)
      .attr("width", 55)
      .attr("ry", 3)
      .attr("x", (d, i) => {
        if (i === 1) {
          return xScale(START_TIME_ENTRY.timeset) - 25;
        } else {
          return xScale(END_TIME_ENTRY.timeset) - 25;
        }
      })
      .attr("y", kwhYScale(kwhRange[1] - 20) - 15);

    startEndLabels
      .append("text")
      .attr("x", (d, i) => {
        if (i === 1) {
          return xScale(START_TIME_ENTRY.timeset) - 25;
        } else {
          return xScale(END_TIME_ENTRY.timeset) - 25;
        }
      })
      .attr("y", kwhYScale(kwhRange[1] - 20) - 15)
      .style("text-anchor", "middle")
      .attr("fill", "white")
      .attr("dy", 20)
      .attr("dx", 55 / 2)
      .text(function (d) {
        return d;
      });

    var triangle = d3.symbol().type(d3.symbolDiamond).size(80);
    startEndLabels
      .append("path")
      .attr("d", triangle)
      .attr("fill", "grey")
      .attr("class", "triangle")
      .attr("transform", (d, i) => {
        const y = kwhYScale(kwhRange[1] - 20) + 15;
        let x;
        if (i === 1) {
          x = xScale(START_TIME_ENTRY.timeset);
        } else {
          x = xScale(END_TIME_ENTRY.timeset);
        }
        return `translate(${x}, ${y}) rotate(90)`;
      })
      .attr("x", (d, i) => {
        if (i === 1) {
          return xScale(START_TIME_ENTRY.timeset) - 25;
        } else {
          return xScale(END_TIME_ENTRY.timeset) - 25;
        }
      })
      .attr("y", kwhYScale(kwhRange[1] - 20));
    // chartG
    //   .append("path")
    //   .datum(data)
    //   .attr("class", "setpoint-line")
    //   .attr("d", fanLine);

    const legend = svg.selectAll("legendBox").data([1]).enter().append("g");
    const legendBox = legend
      .append("g")
      .attr("x", 0)
      .attr("y", height + legendHeight + 10);

    const LegendKeys = ["Usage", "Setpoint", "Outside", "Fan"];

    const legendScale = d3
      .scaleBand()
      .domain(LegendKeys)
      .range([0, legendWidth]);

    legendBox
      .append("rect")
      .attr("fill", "rgba(50,50,50,0.6)")
      .attr("ry", 6)
      .attr("height", 34)
      .attr("width", legendWidth - 50)
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
      .attr("fill", (d) => {
        return {
          Usage: ENERGY_LINE_COLOR,
          Setpoint: SETPOINT_LINE_COLOR,
          Fan: FAN_COLOR,
          Outside: AMBIENT_TEMP_COLOR,
        }[d];
      })
      .attr("height", 20)
      .attr("x", (d, i) => {
        const v = legendWidth / 4;
        return legendScale(d) + v + 63;
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
      .text((d) => d)
      .attr("x", (d, i) => {
        const v = legendWidth / 4;
        return legendScale(d) + v + 93;
      })
      .attr("y", () => {
        const val = Number(legendBox.attr("y"));
        return val + 38;
      })
      .attr("fill", "white");

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
        if (u == "Outside") {
          return `Outside:  ${datapoint["AmbientTemp"]}° F`;
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
      .attr("fill", "var(--zen-blue)")
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
        const hoveredDate = xScale.invert(d3.pointer(event)[0]);

        const getDistanceFromHoveredDate = (d) =>
          Math.abs(xAccessor(d) - hoveredDate);

        const closestIndex = d3.scan(data, (a, b) => {
          return getDistanceFromHoveredDate(a) - getDistanceFromHoveredDate(b);
        });

        const closestDataPoint = data[closestIndex];

        // const closestXValue = dateFormat(d.timeset);
        tracerLineX.attr("y", d3.pointer(event)[1]);
        tracerLineY.attr("x", d3.pointer(event)[0]);

        tracerText.attr("x", d3.pointer(event)[0]).text(closestDataPoint.Time);
        tracerTextBg
          .attr("x", d3.pointer(event)[0] - 38)
          .text(closestDataPoint.Time);

        updateLegendText(closestDataPoint);

        return;
      });
  };
  d3.csv(demandGenius).then((d) => render(d));
  // render(demandGenius);
}

// tryAgain();
