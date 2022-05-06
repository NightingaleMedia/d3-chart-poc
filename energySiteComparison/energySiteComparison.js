import siteEvents from "../data/energySiteBreakdown.json";
import _ from "lodash";
// ENERGY LINE
const makeLine = ({ data, xScale, y, color, selector, className }) => {
  const energyLine = d3
    .line()
    .curve(d3.curveNatural)
    .x((d) => xScale(d.timeset))
    .y((d) => -y(d.usage) - 35);

  selector
    .append("path")
    .datum(data)
    .attr("class", className)
    .attr("d", energyLine)
    .attr("stroke", color)
    .attr("fill", "none");
};

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
export const generateSiteComparison = () => {
  var svg = d3.select("svg.energy-site-comparison"),
    margin = { top: 30, right: 50, bottom: 30, left: 50 },
    legendHeight = 80,
    tooltipWidth = svg.attr("width") - margin.left - margin.right,
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom - legendHeight;
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

  const hourFormat = d3.timeFormat("%-I%p");

  function render(data) {
    // Transform data
    const parseTime = d3.timeParse("%m-%d-%Y %H:%M");
    const parseDayOfYear = d3.timeFormat("%j-%Y");

    data.forEach(function (d, i) {
      d.index = i;
      d.usage.forEach((usage) => {
        usage.timeset = parseTime(usage.time);
        usage.dayOfYear = parseDayOfYear(usage.timeset);
        usage.dateNum = Date.parse(new Date(usage.timeset));
        usage.siteName = d.siteName;
      });
    });

    data = data.reduce((arr, item) => {
      return [...arr, ...item.usage];
    }, []);

    const dataXrange = d3.extent(data, function (d) {
      return d.timeset;
    });

    const granularYRange = [0, Math.ceil(d3.max(data, (d) => d.usage)) + 10];
    const aggregateYRange = [0, 1100];

    const x = d3.scaleTime().domain(dataXrange).range([0, width]).nice();
    const y = d3.scaleLinear().range([0, -height]).domain(granularYRange);

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

    // const barsG = chartG.append("g").attr("class", "data-bars");

    const groupedData = d3.group(data, (d) => d.siteName);

    groupedData.forEach((d, key) => console.log({ key }));
    const colorDomain = d3
      .scaleLinear()
      .domain([0, groupedData.size])
      .range([0, 1]);

    const getColor = (number) => d3.interpolateWarm(colorDomain(number));

    const makeLines = (lineData, className) => {
      let i = 0;
      lineData.forEach((d, key) => {
        makeLine({
          data: d,
          xScale: x,
          y,
          color: getColor(i),
          selector: chartG,
          className,
        });
        i++;
      });
    };

    const aggregateData = [];

    groupedData.forEach((data, key) => {
      const value = d3
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
      aggregateData.push(value);
    });

    makeLines(groupedData, "granular-line");
    makeLines(aggregateData, "aggregate-line");

    // LEGEND
    const makeLegend = () => {
      let i = 0;
      groupedData.forEach((d, key) => {
        d3
          .select(".site-comparison--legend")
          .append("div")
          .style("background-color", getColor(i))
          .style("padding", "1rem")
          .style("color", "white").html(`
          <div style="text-align: center; min-width:80px;">
          <strong>${key}</strong><div id=${key}>0 kwh</div>
          </div>`);
        i++;
      });
    };
    makeLegend();
    const tracer = chartG.append("g");
    const tracerLineY = tracer
      .append("rect")
      .attr("class", "single-event--track-line-y")
      .attr("fill", "white")
      .attr("height", height)
      .attr("width", 0.4)
      .attr("x", -100)
      .attr("y", -40);

    const zoom = d3
      .zoom()
      .scaleExtent([0.9, data.length / 120])
      .extent([
        [margin.left, 0],
        [width - margin.right, height],
      ])
      .translateExtent([
        [margin.left, -Infinity],
        [width - margin.right, Infinity],
      ])
      .on("zoom", _.throttle(zoomed, 100, { leading: false }));

    function zoomed(event) {
      const xz = event.transform.rescaleX(x);
      const { isGranular } = getGranular(xz);
      mx.call(x1MonthAxis, xz);
      gx.call(xAxis, xz);
      gy.call(yAxis, y);
      //   makeLines();
      y.domain(isGranular ? granularYRange : aggregateYRange);

      if (isGranular) {
        chartG.selectAll(".aggregate-line").attr("opacity", 0);
        chartG
          .selectAll(".granular-line")
          .transition()
          .attr("opacity", 1)
          .attr(
            "d",
            d3
              .line()
              // .curve(d3.curveNatural)
              .x((d) => getXWidth(d, xz, "x", isGranular))
              .y((d) => y(d.usage) + height - 30),
          );
        // gy.call(yAxis, y);
        // svg.selectAll("rect").exit().remove(bars);
      } else {
        chartG.selectAll(".granular-line").attr("opacity", 0);
        chartG
          .selectAll(".aggregate-line")
          .transition()
          .attr("opacity", 1)
          .attr(
            "d",
            d3
              .line()
              // .curve(d3.curveNatural)
              .x((d) => getXWidth(d, xz, "x", isGranular))
              .y((d) => y(d.usage) + height - 30),
          );
      }
    }

    svg
      .call(zoom)
      .transition()
      .duration(750)
      .call(zoom.scaleTo, 4, [x(data[data.length - 1].timeset), 0]);

    svg.call(d3.drag());

    chartG
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("cursor", "crosshair")
      .attr("fill", "rgba(0,0,0,0)")
      .on("mousemove", function (event) {
        const hoveredDate = x.invert(d3.pointer(event)[0]);
        tracerLineY.attr("x", d3.pointer(event)[0]);
        console.log({ hoveredDate });
        return;
      });
  }

  // d3.json("../data/energyUsage.json").then((d) => render(d.data, d.threshold));
  setTimeout(() => {
    // console.log(siteEvents);
    render(siteEvents.data);
  }, 10);
};
