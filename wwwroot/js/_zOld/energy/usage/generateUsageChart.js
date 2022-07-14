import * as d3 from "../../../_snowpack/pkg/d3.js";

let inMemId;
export const generateChart = (id) => {
  var svg = d3.select(`svg#${id}`),
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

  function render(data) {
    console.log({ render: data });
    // Transform data
    data = data.map(function (d, i) {
      d = { time: d };
      d.index = i;
      const parseTime = d3.timeParse("%m/%d/%Y");
      d.timeset = parseTime(d.time.slice(0, d.time.search(" ")));
      console.log("timeset: ", d);
      return d;
    });

    var dataXrange = d3.extent(data, function (d) {
      return d.timeset;
    });

    const xScale = d3.scaleUtc().domain(dataXrange).range([0, width]).nice();

    const yScale = d3
      .scaleBand()
      .range([height, 0])
      .domain([1, 2, 3, 4, 5])
      .padding(0);

    const xAxis = d3
      .axisBottom()
      .scale(xScale)
      .ticks(30)
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
      .tickFormat(d3.utcFormat("%B %Y"))
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
          .attr("opacity", "1")
          .attr("text-anchor", "start")
          .attr("transform", "translate(20,30)")
          .style("font-size", "1rem");

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
  }

  const data = document.querySelector(`div#${id}`).dataset.daterangearray;
  console.log({ b4split: data });
  render(data.split(","));

  //   d3.json("../data/dg-past-events.json", function (d) {
  //     makeDataDiv(d);
  //   });
};

export function updateChart(id) {
  generateChart(id);
}
// export function generateChart(id) {
// c3.generate({
//   bindto: `#${id}`,
//   data: {
//     columns: [["value", ...rand100()]],
//     type: "bar",
//     colors: {
//       value: function (d) {
//         if (d.value > 75) {
//           return "var(--mud-palette-warning)";
//         } else return "var(--mud-palette-primary)";
//       },
//     },
//   },
//   axis: {
//     x: {
//       show: false,
//       type: "category",
//     },
//     y: {
//       show: false,
//     },
//   },
//   legend: {
//     show: false,
//   },
// });
// }
