// import { utcMonth } from "d3.js";
import { colorMap, iconMap } from "./icons.js";
import { eventTypes } from "./eventTypes.js";
export const generateDGPastEventChart = () => {
  var svg = d3.select("svg.demand-genius-past"),
    margin = { top: 50, right: 20, bottom: 30, left: 20 },
    tooltipHeight = 110,
    tooltipWidth = svg.attr("width") - margin.left - margin.right,
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom - tooltipHeight;

  const chartG = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .attr("width", width)
    .attr("height", height);

  const bg = chartG
    .append("rect")
    .style("fill", "#232828")
    .attr("rx", 6)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("transform", `translate(${-margin.left}, ${-margin.top})`);

  const tooltipBox = chartG
    .append("g")
    // .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .attr("class", "tooltip-group");

  tooltipBox
    .append("rect")
    .attr("height", tooltipHeight)
    .attr("width", 150)
    .attr("fill", "steelBlue")
    .attr("class", "tooltip-box")
    .attr("opacity", 0)
    .attr("ry", 3)
    .attr("y", Number(chartG.attr("height")) + margin.top + 10);

  const tooltipDiv = d3
    .select(".dg-past-event--tooltip")
    .style("top", `${Number(chartG.attr("height")) + margin.top + 40}px`);
  const toolTipDateDiv = tooltipDiv.select("#dg-past-event--tooltip__date");
  const toolTipNameDiv = tooltipDiv.select("#dg-past-event--tooltip__name");

  function render(data) {
    // Transform data
    data.forEach(function (d, i) {
      d.index = i;
      const parseTime = d3.timeParse("%m/%d/%Y");
      d.timeset = parseTime(d.Date);
    });

    var dataXrange = d3.extent(data, function (d) {
      return d.timeset;
    });
    const SINGLE_EVENT_LW = 40;
    const xScale = d3.scaleUtc().domain(dataXrange).range([0, width]).nice();

    const yScale = d3
      .scaleBand()
      .range([height, 0])
      .domain([1, 2, 3, 4, 5])
      .padding(0);

    const xAxis = d3
      .axisBottom()
      .scale(xScale)
      .ticks(data.length)
      .tickSize(-5)
      .tickFormat((d, i) => {
        const f = d3.timeFormat("%-m/%d");
        return f(d);
      });
    const yAxis = d3.axisLeft().scale(yScale).tickSize(-width);

    const x1MonthAxis = d3
      .axisTop()
      .scale(xScale)
      .ticks(d3.utcMonth)
      .tickFormat(d3.utcFormat("%B"))
      .tickSize(-height - margin.bottom - margin.top);

    chartG
      .append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .call((g) =>
        g
          .selectAll(".tick line, .tick text, .domain")
          .attr("stroke-width", 0)
          .style("display", "none")
          .attr("stroke-opacity", 0)
          .attr("stroke", "0"),
      )
      .call((g) => {
        g.selectAll(".tick:first-of-type line")
          .attr("stroke-width", 0)
          .attr("stroke-opacity", 1)
          .attr("stroke", "white");
        g.selectAll(".tick:last-of-type line")
          .attr("stroke-width", 0)
          .attr("stroke-opacity", 1)
          .attr("stroke", "white");
      });

    chartG
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${height + 10})`)
      .call(xAxis)
      .call((g) => {
        g.selectAll(".tick text")
          .attr("stroke", "none")
          .attr("fill", "white")
          .attr("font-size", "13px")
          .attr("letter-spacing", 0.5);
        g.selectAll(".tick line")
          .attr("stroke-width", 0)
          .attr("stroke-opacity", 1)
          .attr("stroke", "white");

        g.selectAll(".domain").attr("stroke-width", 0);
      });
    chartG
      .append("g")
      .attr("class", "xMonthAxis")
      // .attr("x", 200)
      // .attr("height", height)
      .attr("transform", `translate(${24}, ${-50})`)
      .call(x1MonthAxis)
      .call((g) => {
        g.selectAll(".tick line")
          .attr("stroke-width", 2)
          .attr("stroke-opacity", 1)
          .attr("fill", "white")
          .attr("stroke", "black")
          .style("font-size", "14px");

        g.selectAll(".tick text")
          .attr("fill", "white")
          // .attr("stroke", "white")
          .attr("opacity", "0.1")
          .attr("text-anchor", "start")
          .attr("transform", "translate(16,233)")
          .style("font-size", "10rem");

        g.selectAll(".domain")
          .attr("stroke-width", 0)
          .attr("stroke-opacity", 1)
          .attr("stroke", "white");

        // hide inner
        g
          // .selectAll(".tick:not(:first-of-type) line")
          .selectAll(
            ".tick:not(:last-of-type) line, .tick:not(:last-of-type):not(:first-of-type) text ",
          )
          .attr("fill", "none")
          .attr("stroke", 0)
          .attr("text-anchor", "start")
          .attr("transform", "translate(16,33)")
          .style("font-size", "16px");
      });

    const flattenData = () => {
      const allData = [];
      const keys = Object.keys(data[0]).filter((d) => eventTypes.includes(d));
      data.map((d, index) => {
        let keyIndex = 1;

        keys.map((key) => {
          // if there are some events in there
          const dt = [...allData];
          const otherEvents = dt.filter((ad) => ad.Date === d.Date).length;
          //see if there is another for that day in our existing array

          console.log("found: ", otherEvents, "events");
          if (d[key].length > 0) {
            console.log(d[key]);
            allData.push({
              Date: d.Date,
              id: Date.parse(d.Date) + index,
              keyIndex: keyIndex + otherEvents,
              type: key,
              timeset: d.timeset,
              count: d[key].length,
            });
          }
        });
      });
      return allData;
    };

    const flatData = flattenData();

    console.log(flatData);
    // individual events

    const squareG = chartG
      .selectAll("group")
      .data(flatData)
      .enter()
      .append("g");

    console.log({ flatData });

    squareG
      .append("rect")
      .attr("y", (d) => yScale(d.keyIndex))
      .attr("x", (d) => xScale(d.timeset) + 22)
      .attr("ry", 3)
      .attr("width", SINGLE_EVENT_LW - 5)
      .attr("height", SINGLE_EVENT_LW - 5)
      .style("cursor", "pointer")
      .attr("fill", (d) => colorMap(d.type))

      .on("mouseover", function (d) {
        tooltipDiv
          .transition()
          .duration(500)
          .style("opacity", 1)
          .style("left", `${xScale(d.timeset) - 35}px`);

        toolTipDateDiv.text(() => {
          const f = d3.timeFormat("%m/%d/%y");
          return f(d.timeset);
        });
        if (Number(d.count) > 1) {
          toolTipNameDiv.text(`${d.type} (${d.count})`);
        } else {
          toolTipNameDiv.text(`${d.type}`);
        }
      });

    const icon = squareG
      .append("svg")
      .attr("width", SINGLE_EVENT_LW)
      .attr("height", SINGLE_EVENT_LW)
      .style("cursor", "pointer")
      .attr("viewBox", `0 0 35 35`)
      .attr("y", (d) => yScale(d.keyIndex))
      .attr("x", (d) => xScale(d.timeset) + 22);

    icon
      .append("path")
      .attr("fill", "white")
      .attr("transform", "translate(3,3)")
      .attr("width", SINGLE_EVENT_LW)
      .attr("height", SINGLE_EVENT_LW)
      .attr("d", (d) => iconMap(d.type));

    const circles = squareG
      .append("circle")
      .attr("fill", "#ff0e00")
      .attr("stroke", "#181818")
      .attr("stroke-width", 2)
      .attr("r", (d) => (d.count > 1 ? 9 : 0))
      .attr("cy", (d) => yScale(d.keyIndex))
      .attr("cx", (d) => xScale(d.timeset) + 55);

    squareG
      .append("text")
      .text((d) => (d.count > 1 ? d.count : ""))
      .attr("fill", "white")
      .attr("text-anchor", "middle")
      .attr("stroke", 0)
      .attr("font-size", "13")
      .attr("font-weight", "600")
      .attr("y", (d) => yScale(d.keyIndex) + 5)
      .attr("x", (d) => xScale(d.timeset) + 55);
    // .on("mouseout", function (d) {
    //   console.log("out");
    //   toolTipInner.transition().duration(500).delay(1000).attr("opacity", 0);
    // });
  }

  d3.json("../data/dg-past-events.json", function (d) {
    render(d);
  });
};
