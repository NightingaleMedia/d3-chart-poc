import {
  timeFormat,
  line,
  select,
  max,
  scaleLinear,
  scaleTime,
  extent,
  axisBottom,
  axisRight,
  axisTop,
  timeParse,
  drag,
  pointer,
  utcFormat,
  interpolateWarm,
  group,
  rollups,
  sum,
  zoom,
  ScaleTime,
  ScaleLinear,
  curveNatural,
} from "d3";
import siteEvents from "../../data/energySiteBreakdown.json";
import _ from "lodash";
import {
  EnergySiteComparisonResponse,
  EnergySiteUsageAggregate,
  SiteUsage,
} from "../types/EnergySiteComparison";
import {
  getGranular,
  getXMonthTicks,
  getXTicks,
  getXWidth,
} from "../../utils/chartUtils";
import { makeLine } from "./makeLine";

export const generateEnergySiteComparisonChart = (
  svgId: string = "#energy-site-comparison",
  data: Record<string, any>,
) => {
  var svg = select(`svg#${svgId}`),
    margin = { top: 30, right: 50, bottom: 30, left: 50 },
    legendHeight = 80,
    tooltipWidth = Number(svg.attr("width")) - margin.left - margin.right,
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom - legendHeight;
  svg.attr("viewBox", [0, 0, width, height]);
  svg.style("cursor", "crosshair");

  // https://stackoverflow.com/questions/38051889/d3-js-how-to-clip-area-outside-rectangle-while-zooming-in-a-grouped-bar-chart
  const chartG = svg.append("g");

  chartG
    .append("rect")
    .attr("width", width)
    .attr("height", height + margin.top)
    .attr("fill", "var(--zss-chart-bg)")
    .attr("transform", `translate(0, -${margin.top + margin.bottom})`);

  const hourFormat = timeFormat("%-I%p");

  function render(jsonData: any) {
    // Transform data
    const parseTime = timeParse("%m-%d-%Y %H:%M");
    const parseDayOfYear = timeFormat("%j-%Y");

    jsonData.forEach(function (d, i) {
      d.index = i;
      d.usage = d.usage.map((singleSite) => {
        const timeset = parseTime(singleSite.time) || new Date();
        if (isNaN(parseInt(singleSite.usage))) singleSite.usage = 0;
        const siteUsage: SiteUsage = {
          usage: singleSite.usage,
          timeset,
          dayOfYear: parseDayOfYear(timeset),
          dateNum: Date.parse(new Date(timeset) as unknown as string),
          siteName: d.siteName,
        };

        return siteUsage;
        // TODO handle if we only have day average
      });
    });

    const data: SiteUsage[] = jsonData.reduce((arr, item) => {
      return [...arr, ...item.usage];
    }, []);

    // had to do this because extent can return 'undefined'
    const foundDataXRange = extent(data, (d) => d.timeset);

    const dataXrange: Iterable<Date> = [
      foundDataXRange[0] || new Date(),
      foundDataXRange[1] || new Date(),
    ];

    const granularYRange = [
      0,
      Math.ceil(max(data, (d) => d.usage) || 1100) + 10,
    ];
    //  TODO calculate aggregate y range
    const aggregateYRange = [0, 1100];

    // TODO update any any
    const x: ScaleTime<any, any, any> = scaleTime()
      .domain(dataXrange)
      .range([0, width])
      .nice();
    const y: ScaleLinear<any, any, any> = scaleLinear()
      .range([0, -height])
      .domain(granularYRange);

    const xAxis = (g, x) => {
      const { isGranular, diff } = getGranular(x);
      g.attr("transform", `translate(0, ${height - margin.bottom})`).call(
        axisBottom(x)
          .scale(x)
          .tickSize(5)
          // .ticks(isGranular ? d3.timeHour.every(2) : 10)
          .ticks(getXTicks(diff, isGranular))
          .tickFormat((d: any | Date) => {
            if (isGranular) {
              return hourFormat(d);
            }
            const f = timeFormat("%-m/%d");
            return f(d);
          }),
      );
      g.selectAll(".tick text, .tick line")
        .attr("fill", "var(--zss-chart-axis-text)")
        .style("text-align", "left")
        .attr("stroke", "none");
    };

    const yAxis = (g, y) => {
      g.attr(
        "transform",
        `translate(${margin.left}, ${-margin.top + height})`,
      ).call(
        axisRight(y)
          .scale(y)
          .tickSize(-width + 70)
          .ticks(3),
      );
      g.selectAll(".tick line, .domain")
        .attr("fill", "none")
        .attr("stroke", "0");
      g.selectAll(".tick text, .tick line").attr(
        "fill",
        "var(--zss-chart-axis-text)",
      );
      g.selectAll(".tick:first-of-type text").attr("fill", "none");
      g.selectAll(".tick text").attr("transform", "translate(-40,0)");
    };

    const x1MonthAxis = (g, x) => {
      const { isGranular } = getGranular(x);
      g.attr("class", "xMonthAxis").call(
        axisTop(x)
          .scale(x)
          .ticks(getXMonthTicks(isGranular))
          .tickFormat(isGranular ? utcFormat("%-m/%d") : utcFormat("%B %Y"))
          .tickSize(-height - margin.bottom - margin.top + 80),
      );
      g.selectAll(".tick line")
        .attr("transform", `translate(${0}, ${-30})`)
        .attr("stroke-width", 1)
        .attr("stroke-opacity", 1)
        .attr("stroke", " var(--zss-chart-axis-line)")
        .style("font-size", "14px");

      g.selectAll(".tick text")
        .attr("fill", "var(--zss-chart-axis-text)")
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

    const groupedData = group(data, (d) => d.siteName);

    const colorDomain = scaleLinear()
      .domain([0, groupedData.size])
      .range([0, 1]);

    const getColor = (number) => interpolateWarm(colorDomain(number));

    const makeLines = (lineData, className) => {
      let i = 0;
      lineData.forEach((d) => {
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

    const aggregateData: Array<EnergySiteUsageAggregate[]> = [];

    groupedData.forEach((data) => {
      const value = rollups(
        data,
        (v) => sum(v, (d) => d.usage),
        (d) => d.dayOfYear,
        // (d) => d.timeset
      ).map(([day, usage]) => {
        const parseTime = timeParse("%j-%Y");
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
        select(".site-comparison--legend")
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

    const zoomFunc: any = zoom()
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
            line()
              .x((d: any) => getXWidth(d, xz, "x", isGranular))
              .y((d: any) => y(d.usage) + height - 30),
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
            line()
              // .curve(d3.curveStepAfter)
              .curve(curveNatural)
              .x((d: any) => getXWidth(d, xz, "x", isGranular))
              .y((d: any) => y(d.usage) + height - 30),
          );
      }
    }

    svg
      .call(zoomFunc)
      .transition()
      .duration(750)
      .call(zoomFunc.scaleTo, 4, [
        x(data[data.length - 1]?.timeset || new Date()),
        0,
      ]);

    svg.call(drag());

    chartG
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("cursor", "crosshair")
      .attr("fill", "rgba(0,0,0,0)")
      .on("mousemove", function (event) {
        const hoveredDate = x.invert(pointer(event)[0]);
        tracerLineY.attr("x", pointer(event)[0]);

        return;
      });
  }

  // d3.json("../data/energyUsage.json").then((d) => render(d.data, d.threshold));
  setTimeout(() => {
    const dataToRender: EnergySiteComparisonResponse = siteEvents;
    render(dataToRender.data);
  }, 10);
};
