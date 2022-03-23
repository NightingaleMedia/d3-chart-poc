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
  const render = (data) => {
    // format month as a date
    data.forEach(function (d, i) {
      const format = d3.timeFormat("%I:%M %p");
      d.index = i;
      d.EventWindow = d.EventWindow.toLowerCase() == "true" ? true : false;
      const parseTime = d3.timeParse("%I:%M %p");
      d.timeset = parseTime(d.Time);
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

    var dataYrange = [64, 79];

    const xScale = d3.scaleTime().domain(dataXrange).range([0, width]).nice();

    const yScale = d3.scaleLinear().range([height, 0]).domain(dataYrange);

    const fanScaleY = d3
      .scaleLinear()
      .domain([0, 3])
      .range([40, height / 3]);

    const fanScaleX = d3
      .scaleBand()
      .domain(data.map((d) => d.timeset))
      .range([0, width]);
    // AXES
    var xAxis = d3.axisBottom().scale(xScale).tickSizeOuter(0);

    var yAxis = d3
      .axisLeft()
      .scale(yScale)
      .ticks(9)
      .tickSize(-width)
      .tickSizeOuter(0);

    chartG
      .append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .call((g) =>
        g
          .selectAll(".tick line, .tick text")
          .attr("stroke-width", 1)
          .attr("stroke-opacity", 0.6)
          .attr("stroke", "white"),
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
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis)
      .call((g) =>
        g
          .selectAll(".tick line, .tick text")
          .attr("stroke-width", 1)
          .attr("stroke-opacity", 0.6)
          .attr("stroke", "white"),
      );

    //   .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // START END
    const startEnd = fullChart
      .selectAll("rect")
      .data([1])
      .enter()
      .append("rect")
      .attr("class", "test-square")
      .attr("fill", "rgba(255,255,255,0.2)")
      .attr("height", height - yScale(78))
      .attr("width", () => {
        const start = xScale(START_TIME_ENTRY.timeset);
        const end = xScale(END_TIME_ENTRY.timeset);
        return end - start;
      })
      .attr("x", xScale(data[4].timeset))
      .attr("y", yScale(78));
    const energyLine = d3
      .line()
      .curve(d3.curveNatural)
      .x((d) => xScale(d.timeset))
      .y((d) => yScale(d.EnergyUsage));
    const setpointLine = d3
      .line()
      .curve(d3.curveNatural)
      .x((d) => xScale(d.timeset))
      .y((d) => yScale(d.SetPoint));

    const fanLine = d3
      .line()
      .x((d) => xScale(d.timeset))
      .y((d) => {
        return fanScale(d.Fan);
      });

    var area = d3
      .area()
      .x((d) => d.timeset)
      .y((d) => d.EnergyUsage);

    chartG.append("path").datum(data).attr("d", area);

    // FANLINE
    chartG
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("fill", "rgba(0, 80, 180, 0.5)")
      .attr("stroke-width", 0.7)
      .attr("stroke", FAN_COLOR)
      .attr("stroke-opacity", 0)
      .attr("x", (d) => fanScaleX(d.timeset))
      .attr("y", (d) => height - fanScaleY(d.Fan))
      .attr("height", (d) => fanScaleY(d.Fan))
      .attr("width", width / data.length);

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
      .attr("y", yScale(78) - 15);

    startEndLabels
      .append("text")
      .attr("x", (d, i) => {
        if (i === 1) {
          return xScale(START_TIME_ENTRY.timeset) - 25;
        } else {
          return xScale(END_TIME_ENTRY.timeset) - 25;
        }
      })
      .attr("y", yScale(78) - 15)
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
        const y = yScale(78) + 15;
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
      .attr("y", yScale(78));
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
  };

  d3.csv("../data/demand-genius.csv", function (d) {
    render(d);
  });
}

// tryAgain();
