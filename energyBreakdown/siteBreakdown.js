import { makeXAxis, makeYAxis } from "./makeAxis.js";
import { flattenData } from "./flattenEnergyData.js";

export function makeBreakdownChart() {
  const THRESHOLD = 80,
    ABOVE_THRESHOLD_COLOR = "#ea212d",
    BELOW_THRESHOLD_COLOR = "#00c564";

  var svg = d3.select("svg.sigman-bar"),
    margin = { top: 20, right: 20, bottom: 20, left: 20 },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

  const chartG = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .style("background-color", "#181818");

  var div = d3
    .select("body")
    .append("div")
    .attr("class", "energy-breakdown-chart--tooltip")
    .style("opacity", 0);

  const render = (data) => {
    data.sort((x, y) => d3.descending(x.KwH, y.KwH));

    data.forEach((d, i) => (d.index = i));

    const flatData = flattenData(data);

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.KwH)])
      .range([0, width])
      .nice();

    const yScale = d3
      .scaleBand()
      .domain(data.map((d) => d.SiteName))
      .range([0, height])
      .padding(0.6);

    // AXES
    const xAxis = d3
      .axisTop(xScale)
      .tickSize(height - 20)
      .tickSizeOuter(0)
      .ticks(7);

    const yAxis = d3.axisLeft(yScale).tickSizeOuter(0).tickSizeInner(0);

    makeXAxis(chartG, xAxis, height);
    makeYAxis(chartG, yAxis);

    const barGroup = chartG
      .selectAll("rect")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "grey-bars");

    chartG
      .selectAll("rect")
      .data(flatData)
      .enter()
      .append("rect")
      .attr("class", (d) => `${d.SiteName} chart-child`)
      .attr("fill", (d) =>
        xScale(d.KwH) > xScale(THRESHOLD)
          ? ABOVE_THRESHOLD_COLOR
          : BELOW_THRESHOLD_COLOR,
      )
      .attr("rx", 3)
      .attr("stroke", "#181818")
      .attr("stroke-width", "1")
      .attr("opacity", 0)
      .attr("x", (d, i) => {
        if (d.index == 0) {
          return xScale(0);
        }
        const allChildren = flatData.filter((ch) => ch.SiteName == d.SiteName);
        let offset = 0;
        allChildren.forEach((ch) => {
          if (ch.index < d.index) {
            offset += ch.KwH;
          }
        });
        return xScale(offset);
      })
      .attr("y", (d) => yScale(d.SiteName))
      .attr("height", yScale.bandwidth())
      .attr("data-id", (d) => d.ChildName)
      .attr("data-parentId", (d) => d.SiteName)
      .attr("width", (d) => xScale(d.KwH))
      .style("transition", "all 100ms ease");

    const greyBars = barGroup
      .append("g")
      .append("rect")
      .attr("y", (d) => yScale(d.SiteName))
      .attr("rx", 3)
      .attr("id", (d) => d.id)
      .attr("class", "grey-bar")
      .attr("width", 0)
      .attr("height", yScale.bandwidth())
      .attr("fill", "var(--zen-blue)")
      .attr("opacity", 0.7);

    barGroup
      .selectAll("rect.grey-bar")
      .transition()
      .duration(1000)
      .delay((d, i) => d.index * 120)

      .attr("width", (d) => xScale(d.KwH))
      .ease();

    // ANIMATIONS
    chartG
      .selectAll("rect")
      .on("mouseover", function (e, d) {
        div.transition().duration(500).style("opacity", 0.9);
        div
          .html(
            `
              <div>
              <strong> ${d.ChildName} </strong>
              <br/> 
              <div>
                kwh: ${d.KwH} 
              </div>
              </div>
            `,
          )
          .style("left", e.pageX + "px")
          .style("top", e.pageY + "px");

        d3.selectAll(`.${d.SiteName}`)
          .transition()
          .duration("50")
          .attr("opacity", "1")
          .attr("cursor", "pointer");
      })
      .on("mouseout", function (e, d) {
        div.style("opacity", 0);
        d3.selectAll(`.${d.SiteName}`)
          .transition()
          .duration("50")
          .attr("opacity", "0");
      });
  };

  d3.json("./data/energyChildren.json").then((d) => render(d.data));
}

function showAll(e) {
  console.log("show All...");
  var svg = d3.select("svg.sigman-bar");
  const children = svg.selectAll(".chart-child");
  console.log(children);
  if (children.attr("opacity") == 0) {
    children.attr("opacity", "1");
    e.target.innerText = "Hide All";
  } else {
    children.attr("opacity", "0");
    e.target.innerText = "Show All";
  }
}