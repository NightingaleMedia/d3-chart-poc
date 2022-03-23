export const generateDGPastEventChart = () => {
  var svg = d3.select("svg.demand-genius-past"),
    margin = { top: 30, right: 50, bottom: 30, left: 50 },
    tooltipHeight = 320,
    tooltipWidth = 120,
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom - tooltipHeight;

  const TooltipDiv = d3
    .select("body")
    .append("div")
    .style("opacity", "1")
    .style("position", "absolute")
    .attr("class", "dg-tooltip");
  // const defs = svg
  //   .append("defs")
  //   .append("clipPath")
  //   .attr("id", "clip")
  //   .append("rect")
  //   .attr("width", width)
  //   .attr("height", height);

  const chartG = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .style("background-color", "#181818")
    .attr("width", width)
    .attr("height", height);

  function render(data) {
    console.log(data);

    // Transform data
    data.forEach(function (d, i) {
      d.index = i;
      const parseTime = d3.timeParse("%m/%d/%Y");
      d.timeset = parseTime(d.Date);
      console.log(d);
    });

    var dataXrange = d3.extent(data, function (d) {
      return d.timeset;
    });
    const SINGLE_EVENT_LW = 40;
    const xScale = d3.scaleTime().domain(dataXrange).range([0, width]).nice();

    const yScale = d3
      .scaleBand()
      .range([height, 0])
      .domain([
        "UtilityDR",
        "AbnormallyHot",
        "AbnormallyCold",
        "RoomRefresh",
        "GreenEnergy",
      ]);

    var xAxis = d3
      .axisBottom()
      .scale(xScale)
      .ticks(data.length)
      .tickSize(-height)
      .tickFormat((d, i) => {
        const f = d3.timeFormat("%m/%d");
        return f(d);
      });
    var yAxis = d3.axisLeft().scale(yScale).tickSize(-width);

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
        g.selectAll(".tick:first-of-type line")
          .attr("stroke-width", 1)
          .attr("stroke-opacity", 1)
          .attr("stroke", "white");
        g.selectAll(".tick:last-of-type line")
          .attr("stroke-width", 1)
          .attr("stroke-opacity", 1)
          .attr("stroke", "white");
      });

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

    const flattenData = () => {
      const allData = [];
      const keys = Object.keys(data[0]).filter((d) =>
        yScale.domain().includes(d),
      );
      data.map((d, index) => {
        keys.map((key) => {
          if (d[key].length > 0) {
            allData.push({
              id: Date.parse(d.Date) + index,
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

    console.log({ flatData });
    // individual events
    chartG
      .selectAll("rect")
      .data(flatData)
      .enter()
      .append("rect")
      .attr("y", (d) => yScale(d.type))
      .attr("x", (d) => xScale(d.timeset) - 16)
      .attr("width", SINGLE_EVENT_LW - 5)
      .attr("height", SINGLE_EVENT_LW - 5)
      .attr(
        "fill",
        (d) =>
          ({
            AbnormallyCold: "blue",
            AbnormallyHot: "orange",
            GreenEnergy: "green",
            RoomRefresh: "steelBlue",
            UtilityDR: "purple",
          }[d.type]),
      )
      .on("mouseover", function (d) {
        console.log(d);
        const TOP = tooltipHeight + Number(chartG.attr("height"));
        console.log({ TOP });
        console.log(chartG.attr("height"));
        // TooltipDiv.transition().duration(500).style("opacity", 0.9);
        TooltipDiv.html(`<div style="color:white;"><strong>TEST</strong></div>`)
          .style("top", `1400px`)
          .style("left", `${xScale(d.timeset)}px`)
          .style("height", `${tooltipHeight / 4}px`)
          // .style("left", `${xScale(d.timeset) - 16}px`)
          .style("opacity", 1);
      });
  }

  d3.json("../data/dg-past-events.json", function (d) {
    render(d);
  });
};
