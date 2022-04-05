import { makeXAxis, makeYAxis } from "../energyBreakdown/makeAxis.js";

export function dgChart() {
  var svg = d3.select("svg.demand-genius"),
    margin = { top: 30, right: 50, bottom: 30, left: 50 },
    legendHeight = 50,
    legendWidth = +svg.attr("width") / 2,
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
  // clipPath is used to keep line and area from moving outside of plot area when user zooms/scrolls/brushes

  const ENERGY_LINE_COLOR = "#38feaf";
  const SETPOINT_LINE_COLOR = "#fecc38";
  const FAN_COLOR = "steelBlue";

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

    var tempRange = [64, 79];

    const kwhRange = [
      d3.min(data.map((d) => d.EnergyUsage)),
      d3.max(data.map((d) => d.EnergyUsage)),
    ];

    const xScale = d3.scaleTime().domain(dataXrange).range([0, width]).nice();

    const tempYScale = d3.scaleLinear().range([height, 0]).domain(tempRange);

    const kwhYScale = d3.scaleLinear().range([height, 0]).domain(kwhRange);

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
      .ticks(10)
      .tickFormat((d) => d + "°")
      // .tickSize(-width)
      .tickSizeOuter(0);

    var yLeftAxis = d3
      .axisLeft()
      .scale(kwhYScale)
      .tickFormat((d) => d + " kwh")
      .ticks(9)
      .tickSize(-width + 28)
      .tickSizeOuter(0);

    chartG
      .append("g")
      .attr("class", "y axis right")
      .call(yRightAxis)
      .call((g) =>
        g
          .selectAll(".tick text")
          .attr("stroke-width", 0.2)
          .attr("stroke-opacity", 1)
          .attr("stroke", "white")
      )
      .call((g) => {
        g.selectAll(".tick line")
          .attr("stroke-width", 0)
          .attr("stroke-opacity", 0);
        g.selectAll(
          ".tick:last-of-type line, .tick:last-of-type text, .tick:first-of-type line, .tick:first-of-type text"
        )
          .attr("stroke-width", 0)
          .attr("stroke-opacity", 0)
          .attr("stroke", "white");
      })
      .attr("transform", `translate(${width - 28},0)`);

    // KWH Line
    chartG
      .append("g")
      .attr("class", "y axis left")
      .call(yLeftAxis)
      .call((g) =>
        g
          .selectAll(".tick line, .tick text")
          .attr("stroke-width", 0.5)
          .attr("stroke-opacity", 0.6)
          .attr("stroke", "white")
      )
      .call((g) => {
        g.selectAll(".tick:first-of-type line, .tick:first-of-type text")
          .attr("stroke-width", 0)
          .attr("stroke-opacity", 0)
          .attr("stroke", "white");
        g.selectAll(".tick:last-of-type line, .tick:last-of-type text")
          .attr("stroke-width", 0)
          .attr("stroke-opacity", 0)
          .attr("stroke", "white");
      });

    //   .attr("transform", "translate(" + width + ", 0)");

    chartG
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${height + 10})`)
      .call(xAxis)
      .call((g) =>
        g
          .selectAll(".tick line, .tick text")
          .attr("stroke-width", 0.3)
          .attr("stroke-opacity", 0.6)
          .attr("stroke", "white")
      );

    function addTracer() {}
    // START END
    const startEnd = fullChart
      .append("rect")
      .attr("class", "test-square")
      .attr("fill", "rgba(255,255,255,0.1)")
      .attr("height", height - kwhYScale(kwhRange[1] - 20))
      .attr("width", () => {
        const start = xScale(START_TIME_ENTRY.timeset);
        const end = xScale(END_TIME_ENTRY.timeset);
        return end - start;
      })
      .attr("x", xScale(START_TIME_ENTRY.timeset))
      .attr("y", kwhYScale(kwhRange[1] - 20));

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
      .attr("class", "fan-line")
      .attr("d", fanLine)
      .attr("stroke", FAN_COLOR)
      .attr("transform", `translate(0, ${height + 38})`);

    //   ENERGY LINE
    chartG
      .append("path")
      .datum(data)
      .attr("class", "energy-line")
      .attr("d", energyLine)
      .attr("stroke", ENERGY_LINE_COLOR);

    //   SET LINE
    chartG
      .append("path")
      .datum(data)
      .attr("class", "setpoint-line")
      .attr("d", setpointLine)
      .attr("stroke", SETPOINT_LINE_COLOR);

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
      .attr("x", 0 + margin.left)
      .attr("y", height + legendHeight + 10);

    const LegendKeys = ["Energy", "Setpoint", "Fan"];

    const legendScale = d3
      .scaleBand()
      .domain(LegendKeys)
      .range([0, legendWidth]);

    const legendSection = legend
      .selectAll("labels")
      .data(LegendKeys)
      .enter()
      .append("g")
      .attr("width", legendScale.bandwidth());

    const colorLabels = legendSection
      .selectAll("labels")
      .data(LegendKeys)
      .enter()
      .append("rect")
      .attr("ry", 3)
      .attr("fill", (d) => {
        return {
          Energy: ENERGY_LINE_COLOR,
          Setpoint: SETPOINT_LINE_COLOR,
          Fan: FAN_COLOR,
        }[d];
      })
      .attr("height", 20)
      .attr("x", (d, i) => {
        return legendScale(d) + margin.left - 8;
      })
      .attr("y", () => {
        const val = Number(legendBox.attr("y"));
        return val + 12;
      })
      .attr("width", 20);

    const legendText = legendSection
      .selectAll("text")
      .data(LegendKeys)
      .enter()
      .append("text")
      .text((d) => d)
      .attr("x", (d, i) => {
        return legendScale(d) + margin.left + 20;
      })
      .attr("y", () => {
        const val = Number(legendBox.attr("y"));
        return val + 28;
      })
      .attr("fill", "white");

    const updateLegendText = (datapoint) => {
      legendText.text((u) => {
        if (u == "Setpoint") {
          return `Setpoint: ${datapoint["SetPoint"]}°`;
        }
        if (u == "Energy") {
          return `Energy: ${datapoint["EnergyUsage"]}KWH`;
        }
        if (u == "Fan") {
          return `Fan: ${datapoint["Fan"]}`;
        }
      });
    };

    const tracer = chartG.append("g");

    const tracerLine = tracer
      .append("rect")
      .attr("class", "track-line")
      .attr("height", height)
      .attr("width", 1)
      .attr("stroke", "rgba(255,255,255,0.6)")
      .attr("stroke-width", 1)
      .attr("y", tempYScale(78));

    const tracerText = tracer
      .append("text")
      .attr("fill", "white")
      .text("test")
      .attr("text-anchor", "middle")
      .attr("x", tracerLine.attr("x"));

    chartG
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("cursor", "crosshair")
      .attr("fill", "rgba(0,0,0,0)")
      .on("mousemove", function (d) {
        const mousePosition = d3.mouse(this);
        const hoveredDate = xScale.invert(mousePosition[0]);

        const getDistanceFromHoveredDate = (d) =>
          Math.abs(xAccessor(d) - hoveredDate);

        const closestIndex = d3.scan(data, (a, b) => {
          return getDistanceFromHoveredDate(a) - getDistanceFromHoveredDate(b);
        });

        const closestDataPoint = data[closestIndex];

        // const closestXValue = dateFormat(d.timeset);
        tracerLine.attr("x", d3.event.pageX - 60);
        tracerText.attr("x", d3.event.pageX - 60).text(closestDataPoint.Time);

        updateLegendText(closestDataPoint);

        return;
      });
  };
  d3.csv("../data/demand-genius.csv", function (d) {
    render(d);
  });
}

// tryAgain();
