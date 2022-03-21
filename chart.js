import { flattenData } from "./flattenEnergyData.js";

export function generateEnergyBreakdownChart(id) {
  console.log("id: ", id);

  c3.generate({
    bindto: "#test-div-c3",
    data: {
      x: "x",
      rows: [
        ["x", "site1", "site2", "site3"],
        ["x", 15, 25, 25],
        ["x", 10, 12, 16],
        ["d", 2, 5, 15, 25],
      ],
      type: "bar",
      groups: [["site1", "site2", "site3"]],
    },
    axis: {
      rotated: true,
      x: { type: "category" },
    },
    grid: {
      y: {
        lines: [
          { value: 0 },
          { value: 10 },
          { value: 20 },
          { value: 30 },
          { value: 40 },
          { value: 50 },
          { value: 60 },
          { value: 70 },
          { value: 80 },
          { value: 90 },
        ],
      },
    },
  });
}

export function makeBar() {
  var svg = d3.select("svg.old-bar"),
    margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var y = d3
    .scaleBand() // x = d3.scaleBand()
    .rangeRound([0, height]) // .rangeRound([0, width])
    .paddingInner(0.45)
    .align(0.1)
    .paddingOuter(1);

  var x = d3
    .scaleLinear() // y = d3.scaleLinear()
    .rangeRound([0, width]); // .rangeRound([height, 0]);

  var z = d3
    .scaleOrdinal()
    .range([
      "#ff8c00",
      "steelBlue",
      "green",
      "red",
      "black",
      "brown",
      "#BADA55",
    ]);

  d3.csv(
    "data_copy.csv",
    function (d, i, columns) {
      let t = 0;
      for (i = 1, t = 0; i < columns.length; ++i)
        t += d[columns[i]] = +d[columns[i]];
      d.total = t;
      return d;
    },
    function (error, data) {
      if (error) throw error;

      var keys = data.columns.slice(1);

      data.sort(function (a, b) {
        return b.total - a.total;
      });

      y.domain(data.map((d) => d.Site)); // x.domain...
      x.domain([0, d3.max(data, (d) => d.total)]).nice(); // y.domain...
      z.domain(keys);

      g.append("g")
        .selectAll("g")
        .data(d3.stack().keys(keys)(data))
        .enter()
        .append("g")
        .attr("fill", function (d) {
          return z(d.key);
        })
        .selectAll("rect")
        .data(function (d) {
          return d;
        })
        .enter()
        .append("rect")
        .attr("y", function (d) {
          return y(d.data.Site);
        }) //.attr("x", function(d) { return x(d.data.State); })
        .attr("x", function (d) {
          return x(d[0]);
        }) //.attr("y", function(d) { return y(d[1]); })
        .attr("width", function (d) {
          return x(d[1]) - x(d[0]);
        }) //.attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("height", y.bandwidth()); //.attr("width", x.bandwidth());

      g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0,0)") //  .attr("transform", "translate(0," + height + ")")
        .call(d3.axisLeft(y)); //   .call(d3.axisBottom(x));

      g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")") // New line
        .call(d3.axisBottom(x).ticks(null, "s")) //  .call(d3.axisLeft(y).ticks(null, "s"))
        .append("text")
        .attr("y", 25) //     .attr("y", 2)
        .attr("x", x(x.ticks().pop()) + 0.5) //     .attr("y", y(y.ticks().pop()) + 0.5)
        .attr("dy", "0.32em") //     .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .text("Population")
        .attr("transform", "translate(" + -width + ",-10)"); // Newline

      var legend = g
        .append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(keys.slice().reverse())
        .enter()
        .append("g")
        //.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
        .attr("transform", function (d, i) {
          return "translate(-50," + (300 + i * 20) + ")";
        });

      legend
        .append("rect")
        .attr("x", width - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", z);

      legend
        .append("text")
        .attr("x", width - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function (d) {
          return d;
        });
    }
  );
}

async function energyChart() {
  var svg = d3.select("svg.sigman-bar"),
    margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    chartG = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const render = (data) => {
    const flatData = flattenData(data);
    console.log(flatData);
    console.log(data.map((d) => d.SiteName));
    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.KwH)])
      .range([0, width])
      .nice();

    const yScale = d3
      .scaleBand()
      .domain(data.map((d) => d.SiteName))
      .range([0, height])
      .padding(0.4);

    chartG
      .append("g")
      .call(d3.axisBottom(xScale).tickSize(-height).tickSizeOuter(0))
      .attr("transform", `translate(0, ${height + 5})`);

    const barGroup = chartG.selectAll("rect").data(data).enter().append("g");

    const allBars = barGroup
      .append("rect")
      .attr("y", (d) => yScale(d.SiteName))
      .attr("width", (d) => xScale(d.KwH))
      .attr("height", yScale.bandwidth())
      .attr("fill", "rgba(0,125,125,0.2)");

    // const sites = barGroup.selectAll("rect");

    chartG
      .selectAll("rect")
      .data(flatData)
      .enter()
      .append("rect")
      .attr("fill", "rgba(200,0,0,1)")
      .attr("stroke", "white")
      .attr("stroke-width", "3")
      .attr("x", (d, i) => {
        if (d.index == 0) {
          return 0;
        }
        const prevIndex = d.index - 1;
        const value = flatData.find(
          (item) => item.SiteName == d.SiteName && item.index == prevIndex
        ).KwH;

        return xScale(1000);
      })
      .attr("y", (d) => yScale(d.SiteName))
      .attr("height", yScale.bandwidth())
      .attr("data-id", (d) => d.ChildName)
      .attr("data-parentId", (d) => d.SiteName)
      .attr("width", (d) => xScale(d.KwH));

    chartG
      .append("g")
      .call(d3.axisLeft(yScale).tickSize(0))
      .attr("transform", `translate(23, -27)`);
  };

  d3.json("energyChildren.json", function (d) {
    render(d.data);
  });
}

// generateEnergyBreakdownChart();
// makeBar();
energyChart();
// tryAgain();
