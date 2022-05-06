import energyUsage from "../data/energyUsage.json";

const getXWidth = (d, xz, type, isGranular) => {
  let len = isGranular
    ? d3.timeHour.offset(d.timeset, 1)
    : d3.timeDay.offset(d.timeset, 1);

  len = (xz(len) - xz(d.timeset)) * 0.6;
  if (type === "x") {
    return xz(d.timeset) - len / 2;
  }
  if (type === "width") {
    return len;
  }
};
function getXMonthTicks(isGranular, diff) {
  // let len = isGranular ? d3.timeHour.every(6) : d3.timeMonth;
  // return len;
  if (isGranular) {
    return d3.timeHour.every(24);
  }
  return d3.timeMonth;
}

function getXTicks(diff, isGranular) {
  if (isGranular) {
    if (diff <= 8 && diff > 3) {
      return d3.timeHour.every(6);
    }
    if (diff <= 3 && diff > 1) {
      return d3.timeHour.every(2);
    } else return d3.timeHour;
  } else {
    return 10;
  }
}
// http://bl.ocks.org/adg29/8868399
const getGranular = (x) => {
  const earliest = new Date(x.domain()[0]);
  const latest = new Date(x.domain()[1]);
  const da = {
    earlyMonth: earliest.getMonth(),
    earlyDay: earliest.getDate(),
    latestMonth: latest.getMonth(),
    latestDay: latest.getDate(),
  };
  return {
    isGranular:
      da.earlyMonth === da.latestMonth && da.latestDay - da.earlyDay <= 8,
    diff: da.latestDay - da.earlyDay,
    ...da,
  };
};
export const generateSummaryChart = () => {
  var svg = d3.select("svg.energy-summary"),
    margin = { top: 30, right: 50, bottom: 30, left: 50 },
    tooltipHeight = 80,
    tooltipWidth = svg.attr("width") - margin.left - margin.right,
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom - tooltipHeight;
  svg.attr("viewBox", [0, 0, width, height]);
  svg.style("cursor", "crosshair");

  // const clip = { id: "testingclip" };

  // https://stackoverflow.com/questions/38051889/d3-js-how-to-clip-area-outside-rectangle-while-zooming-in-a-grouped-bar-chart
  const chartG = svg.append("g");

  chartG
    .append("rect")
    .attr("width", width)
    .attr("height", height + margin.top)
    .attr("fill", "var(--zen-chart-bg)")
    .attr("transform", `translate(0, -${margin.top + margin.bottom})`);

  const tooltipDiv = d3
    .select(".energy-summary--tooltip")
    .style("top", `${height + tooltipHeight}px`)
    .style("left", "0")
    .style("opacity", 0);

  const toolTipDateDiv = tooltipDiv.select("#energy-summary--tooltip__date");
  const toolTipUsageDiv = tooltipDiv.select("#energy-summary--tooltip__usage");

  const hourFormat = d3.timeFormat("%-I%p");

  function render(data, threshold) {
    // Transform data
    data.forEach(function (d, i) {
      d.index = i;
      const parseTime = d3.timeParse("%m-%d-%Y %H:%M");
      const parseDayOfYear = d3.timeFormat("%j-%Y");
      d.timeset = parseTime(d.time);
      d.dayOfYear = parseDayOfYear(d.timeset);
      d.dateNum = Date.parse(new Date(d.timeset));
    });

    const rolledData = d3
      .rollups(
        data,
        (v) => d3.sum(v, (d) => d.usage),
        (d) => d.dayOfYear,
        // (d) => d.timeset
      )
      .map(([day, usage]) => {
        const parseTime = d3.timeParse("%j-%Y");
        return { day, usage, timeset: parseTime(day) };
      });

    const dataXrange = d3.extent(data, function (d) {
      return d.timeset;
    });

    const granularYRange = [0, 80];
    const rolledYRange = [
      0,
      Math.ceil(d3.max(rolledData, (d) => d.usage) / 100) * 100,
    ];

    const x = d3.scaleTime().domain(dataXrange).range([0, width]).nice();

    const y = d3.scaleLinear().range([0, -height]).domain(rolledYRange);

    const xAxis = (g, x) => {
      const { isGranular, diff } = getGranular(x);

      g.attr("transform", `translate(0, ${height - margin.bottom})`).call(
        d3
          .axisBottom()
          .scale(x)
          .tickSize(5)
          // .ticks(isGranular ? d3.timeHour.every(2) : 10)
          .ticks(getXTicks(diff, isGranular))
          .tickFormat((d, i) => {
            if (isGranular) {
              return hourFormat(d);
            }
            const f = d3.timeFormat("%-m/%d");
            return f(d);
          }),
      );
      g.selectAll(".tick text, .tick line")
        .attr("fill", "white")
        .style("text-align", "left")
        .attr("stroke", "none");
    };
    const yAxis = (g, y) => {
      g.attr(
        "transform",
        `translate(${margin.left}, ${-margin.top + height})`,
      ).call(
        d3
          .axisRight()
          .scale(y)
          .tickSize(-width + 70)
          .ticks(3),
      );
      g.selectAll(".tick line, .domain")
        .attr("fill", "none")
        .attr("stroke", "0");
      g.selectAll(".tick text, .tick line").attr("fill", "white");
      g.selectAll(".tick:first-of-type text").attr("fill", "none");
      g.selectAll(".tick text").attr("transform", "translate(-40,0)");
    };

    const x1MonthAxis = (g, x) => {
      const { isGranular, diff } = getGranular(x);
      g.attr("class", "xMonthAxis").call(
        d3
          .axisTop()
          .scale(x)
          .ticks(getXMonthTicks(isGranular, diff))
          .tickFormat(
            isGranular ? d3.utcFormat("%-m/%d") : d3.utcFormat("%B %Y"),
          )
          .tickSize(-height - margin.bottom - margin.top + 80),
      );

      g.selectAll(".tick line")
        .attr("transform", `translate(${0}, ${-30})`)
        .attr("stroke-width", 1)
        .attr("stroke-opacity", 1)
        .attr("stroke", "rgba(255,255,255,0.3)")
        .style("font-size", "14px");

      g.selectAll(".tick text")
        .attr("fill", "white")
        // .attr("stroke", "white")
        .attr("opacity", "1")
        .attr("text-anchor", "start")
        .attr("transform", "translate(10,-10)")
        .style("font-size", "1rem");

      g.selectAll(".domain").remove();
    };
    const mx = chartG.append("g").call(x1MonthAxis, x);
    const gx = chartG.append("g").call(xAxis, x);
    const gy = svg.append("g").call(yAxis, y);

    const barsG = chartG.append("g").attr("class", "data-bars");

    const bars = barsG
      .selectAll("rolled-rect")
      .data(rolledData)
      .enter()
      .append("rect")

      .on("mouseover", function (event, d) {
        d3.select(this).attr("opacity", 0.9);
        tooltipDiv
          .transition()
          .duration(500)
          .style("opacity", 1)
          .style("left", `${event.pageX - 120}px`);

        toolTipDateDiv.text(() => {
          const f = d3.timeFormat("%m/%d");
          return f(d.timeset);
        });

        toolTipUsageDiv.text(`${d.usage} kwh`);
      })
      .on("mouseout", function (event, d) {
        d3.select(this).attr("opacity", 1);
      });

    const granBarsG = chartG.append("g").attr("class", "granular-data-bars");

    const granBars = granBarsG
      .selectAll("granular-rect")
      .data(data)
      .enter()
      .append("rect")
      .on("mouseover", function (event, d) {
        d3.select(this).attr("opacity", 0.9);
        tooltipDiv
          .transition()
          .duration(500)
          .style("opacity", 1)
          .style("left", `${event.pageX - 120}px`);

        toolTipDateDiv.text(() => hourFormat(d.timeset));

        toolTipUsageDiv.text(`${d.usage} kwh`);
      })
      .on("mouseout", function (event, d) {
        d3.select(this).attr("opacity", 1);
      });

    const threshBar = granBarsG
      .selectAll("above-rect")
      .data(data)
      .enter()
      .append("rect");

    const zoom = d3
      .zoom()
      .scaleExtent([0.9, data.length / 20])
      .extent([
        [margin.left, 0],
        [width - margin.right, height],
      ])
      .translateExtent([
        [margin.left, -Infinity],
        [width - margin.right, Infinity],
      ])
      .on("zoom", zoomed);

    function zoomed(event) {
      const xz = event.transform.rescaleX(x);
      // x.domain(xz.domain());

      const { isGranular } = getGranular(xz);

      y.domain(isGranular ? granularYRange : rolledYRange);
      mx.call(x1MonthAxis, xz);
      gx.call(xAxis, xz);
      gy.call(yAxis, y);

      if (isGranular) {
        // gy.call(yAxis, y);
        // svg.selectAll("rect").exit().remove(bars);
        bars.attr("fill", "none");
        granBars
          .attr("x", (d) => getXWidth(d, xz, "x", isGranular))
          .attr("y", (d) => y(d.usage) + height - margin.bottom)
          .attr("width", (d) => getXWidth(d, xz, "width", isGranular))
          .attr("fill", "var(--zen-blue)")
          .attr("height", (d) => -y(d.usage));

        threshBar
          .attr("fill", "var(--zen-warning)")
          .attr("height", (d) => {
            if (d.usage > threshold.hourly) {
              return -y(d.usage) + y(threshold.hourly);
            } else {
              return 0;
            }
          })
          .attr("width", (d) => getXWidth(d, xz, "width", isGranular))
          .attr("x", (d) => getXWidth(d, xz, "x", isGranular))
          .attr("y", (d) => y(d.usage) + height - margin.bottom);
      } else {
        // gy.call(yAxis, y);

        threshBar.attr("fill", "none");
        granBars.attr("fill", "none");
        bars
          .attr("height", (d) => -y(d.usage))
          .attr("width", (d) => getXWidth(d, xz, "width", isGranular))
          .attr("y", (d) => y(d.usage) + height - margin.bottom)
          .attr("x", (d) => getXWidth(d, xz, "x", isGranular))
          .attr("fill", (d) =>
            d.usage > threshold.daily
              ? "var(--zen-warning)"
              : "var(--zen-nominal)",
          );
      }
    }

    svg
      .call(zoom)
      .transition()
      .duration(750)
      .call(zoom.scaleTo, 4, [x(data[data.length - 1].timeset), 0]);

    svg.call(d3.drag());
  }

  // d3.json("../data/energyUsage.json").then((d) => render(d.data, d.threshold));
  setTimeout(() => {
    render(energyUsage.data, energyUsage.threshold);
  }, 1000);
};
