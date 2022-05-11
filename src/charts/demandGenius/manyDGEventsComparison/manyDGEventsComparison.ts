import {
  area,
  axisBottom,
  axisLeft,
  axisRight,
  curveNatural,
  curveStep,
  extent,
  interpolateCool,
  leastIndex,
  line,
  max,
  min,
  pointer,
  scaleLinear,
  scaleTime,
  select,
  selectAll,
  timeFormat,
  timeMinute,
  timeParse,
} from "d3";
import { nest } from "d3-collection";
import {
  DGEventComparisonDataset,
  DGSiteEventDataPoint,
  DGSiteEventDataPointDataItem,
  MakeLines__Props,
} from "../../types/DGManyEventsComparison";
import manyEvents from "../../../data/dg-many-events.json";
// import * as d3 from "d3";
const makeTimeWindow = (selection, props) => {
  const {
    data,
    siteName,
    lineColor,
    colors,
    height,
    kwhYScale,
    kwhRange,
    xScale,
    id,
  } = props;

  const START_TIME_ENTRY =
    data.find((d) => {
      return d.EventWindow == true;
    }) ?? data[0];

  console.log({ START_TIME_ENTRY });
  const END_TIME_ENTRY = data.find((d) => {
    return d.index > START_TIME_ENTRY.index && d.EventWindow == false;
  });

  //   MAKE START END
  const startEnd = selection
    .append("rect")
    .attr("class", `start-end--boundary`)
    .attr("id", id)
    .attr("fill", `${colors.timeColor}`)
    .attr("opacity", 0.15)
    .attr("height", height)
    .attr("width", () => {
      const start = xScale(START_TIME_ENTRY.timeset);
      const end = xScale(END_TIME_ENTRY.timeset);
      return end - start;
    })
    .attr("x", xScale(START_TIME_ENTRY.timeset))
    .attr("y", 0);
};

const makeLines = (selection, props: MakeLines__Props) => {
  const {
    data,
    lineColor,
    colors,
    id,
    height,
    kwhYScale,
    xScale,
    tempYScale,
    fanScaleY,
  } = props;

  // ENERGY LINE
  const energyLine = line()
    .curve(curveNatural)
    .x((d: any) => xScale(d.timeset))
    .y((d: any) => kwhYScale(d.EnergyUsage));

  // SETPOINT LINE
  const setpointLine = line()
    .curve(curveNatural)
    .x((d: any) => xScale(d.timeset))
    .y((d: any) => tempYScale(d.SetPoint));

  // FANLINE
  const fanLine = line()
    .curve(curveStep)
    .x((d: any) => xScale(d.timeset))
    .y((d: any) => {
      return -fanScaleY(d.Fan);
    });

  var areaFunc = area()
    .x((d: any) => d.timeset)
    .y((d: any) => d.EnergyUsage);

  selection.append("path").datum(data).attr("d", areaFunc);

  // FANLINE
  selection
    .append("path")
    .datum(data)
    .attr("class", "many-events--fan-line")
    .attr("id", id)
    .attr("d", fanLine)
    .attr("stroke", colors.fanColor)
    .attr("stroke-width", "2px")
    .attr("fill", "none")
    .attr("transform", `translate(0, ${Number(height) + 38})`);

  //   ENERGY LINE
  selection
    .append("path")
    .datum(data)
    .attr("class", "many-events--energy-line")
    .attr("id", id)
    .attr("d", energyLine)
    .attr("stroke-dasharray", "30 5")
    .attr("stroke-width", "2px")
    .attr("fill", "none")
    .attr("stroke", colors.kwhColor);

  //   SET LINE
  selection
    .append("path")
    .datum(data)
    .attr("class", "many-events--setpoint-line")
    .attr("id", id)
    .attr("d", setpointLine)
    .attr("fill", "none")
    .attr("stroke", colors.setpointColor)
    .attr("stroke-width", "2px");
};

export function makeManyEvents() {
  var svg = select("svg.demand-genius--many"),
    margin = { top: 30, right: 20, bottom: 60, left: 40 },
    legendHeight = 0,
    legendWidth = +svg.attr("width") / 2,
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom - legendHeight,
    selectionWidth = 0,
    chartWidth = width - selectionWidth;

  const defs = svg
    .append("defs")
    .append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", chartWidth)
    .attr("height", height);

  const chartG = svg
    .append("g")
    .attr(
      "transform",
      `translate(${margin.left + selectionWidth}, ${margin.top})`,
    );
  chartG
    .append("rect")
    .attr("height", height + 0)
    .attr("width", width - 50)
    .attr("fill", "var(--zen-chart-bg)")
    .attr("ry", 5)
    .attr("transform", `translate(24, -0)`);

  // clipPath is used to keep line and area from moving outside of plot area when user zooms/scrolls/brushes

  const dateParser = timeParse("%-I:%M %p");
  const dateFormat = timeFormat("%-I:%M%p");

  const xAccessor = (d): Date => {
    if (d) {
      const titleString = dateParser(d.Time) ?? new Date();
      return titleString;
    } else return new Date();
  };

  const render = (jsonData: DGSiteEventDataPoint[]) => {
    // format month as a date
    const data: DGSiteEventDataPointDataItem[] = jsonData.map((d, i) => ({
      index: i,
      timeset: dateParser(d.Time) ?? new Date(),
      ...d,
    }));

    var dataXrange = extent(data, (d) => d.timeset);

    var tempRange = [60, 90];

    //TODO get a better range

    const NUM_TICKS = 8;
    const kwhRange = [
      Number(min(data.map((d) => d.EnergyUsage))) - 20,
      Number(max(data.map((d) => d.EnergyUsage))) + 20,
    ];

    const xScale = scaleTime()
      .domain([dataXrange[0] ?? new Date(), dataXrange[1] ?? new Date()])
      .rangeRound([0, chartWidth])
      .nice();

    const tempYScale = scaleLinear()
      .range([height, 0])
      .domain(tempRange)
      .nice();

    const kwhYScale = scaleLinear().range([height, 0]).domain(kwhRange).nice();

    const fanScaleY = scaleLinear()
      .domain([0, 3])
      .range([40, height / 3]);

    // AXES
    var x = axisBottom(xScale)
      .scale(xScale)
      .tickSizeOuter(0)
      .ticks(timeMinute.every(90))
      .tickFormat((d) => {
        // console.log({ d });
        return dateFormat(d as Date);
      });

    var yRightAxis = axisRight(tempYScale)
      .scale(tempYScale)
      .ticks(NUM_TICKS)
      .tickFormat((d) => d + "°")
      // .tickSize(-width)
      .tickSizeOuter(0);

    var yLeftAxis = axisLeft(kwhYScale)
      .scale(kwhYScale)
      .tickFormat((d) => d + " kwh")
      .ticks(NUM_TICKS)
      .tickSize(-chartWidth + 80)
      .tickSizeOuter(0);

    // TEMP AXIS
    const AXIS_COLOR = "rgb(130, 130, 130)";
    const AXIS_LABEL_COLOR = "white";
    chartG
      .append("g")
      .attr("class", "y axis right")
      .call(yRightAxis)
      .call((g) =>
        g
          .selectAll(".tick text")
          .attr("text-rendering", "optimizeLegibility")
          .attr("fill", AXIS_LABEL_COLOR),
      )
      .call((g) => {
        g.selectAll(".tick line").attr("stroke-width", 0);
        g.selectAll(".tick:first-of-type line, .tick:first-of-type text").attr(
          "opacity",
          0,
        );
      })
      .attr("transform", `translate(${chartWidth - 28},0)`);

    // KWH axis
    chartG
      .append("g")
      .attr("class", "y axis left")
      .attr("transform", `translate(15, 0)`)
      .call(yLeftAxis)
      .call((g) => {
        g.selectAll(".tick text")
          .attr("fill", AXIS_LABEL_COLOR)
          .attr("text-rendering", "optimizeLegibility");
        g.selectAll(".tick line")
          .attr("stroke", "rgba(45,45,45,1)")
          .attr("text-rendering", "optimizeLegibility");
        g.selectAll(".tick line").attr("transform", "translate(15,0)");
      })
      .call((g) => {
        g.selectAll(
          ".tick:nth-of-type(odd) line, .tick:first-of-type text, .tick:nth-of-type(2) line",
        ).attr("opacity", 0);
      });

    // X AXIS
    const xAxis = chartG
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${height + 4})`)
      .call(x)
      .call((g) => {
        g.selectAll(".tick line, .tick text")
          .attr("text-rendering", "optimizeLegibility")
          .attr("fill", AXIS_LABEL_COLOR);
        g.selectAll(".tick:first-of-type line, .tick:first-of-type text").attr(
          "opacity",
          0,
        );

        g.selectAll(".tick:last-of-type line, .tick:last-of-type text").attr(
          "opacity",
          1,
        );
      });

    // Make data for each
    let datasets = nest()
      .key((d) => d.Site)
      .entries(data);

    const createdDataset: DGEventComparisonDataset[] = datasets.map(
      (d, index) => {
        console.log(index);
        const colorDomain = scaleLinear()
          .domain([0, datasets.length])
          .range([0, 1]);

        const getColor = (number) => interpolateCool(colorDomain(number));

        const colors = {
          fanColor: getColor(index + 0.33),
          setpointColor: getColor(index + 0.66),
          kwhColor: getColor(index + 0.99),
          timeColor: getColor(index),
        };

        const color = interpolateCool(colorDomain(index));
        return { ...d, color, colors, id: btoa(d.key) };
      },
    );

    console.log({ datasets });

    createdDataset.forEach((d, index) => {
      const props = {
        data: d.values,
        id: d.id,
        lineColor: d.color,
        colors: d.colors,
        siteName: d.key,
        height,
        kwhYScale,
        kwhRange,
        xScale,
        tempYScale,
        fanScaleY,
      };
      makeTimeWindow(chartG, props);
    });

    createdDataset.forEach((d, index) => {
      const props: MakeLines__Props = {
        data: d.values,
        lineColor: d.color,
        siteName: d.key,
        colors: d.colors,
        id: d.id,
        height,
        kwhYScale,
        kwhRange,
        xScale,
        tempYScale,
        fanScaleY,
      };
      makeLines(chartG, props);
    });

    const selectionBox = select(".selection--wrap")
      .selectAll("div")
      .data(createdDataset)
      .enter()
      .append("div")
      .style("background-color", (d) => d.color)
      .style("cursor", "pointer")
      .style("color", "white")
      .attr("class", `site--selector`)
      .attr("id", (d) => d.id)
      .attr("data-selected", true)
      .on("click", function (event, d) {
        const allElems = selectAll(`#${d.id}`);

        if (this.dataset.selected === "true") {
          this.dataset.selected = "false";
          allElems.transition().duration(200).attr("opacity", 0).ease();
          this.classList.add("deselected");
          select(this).style("background-color", "unset");
        } else {
          this.dataset.selected = "true";
          this.classList.remove("deselected");
          const startEnd = selectAll(`#${d.id}.start-end--boundary`);
          const allLines = selectAll(`path#${d.id}`);
          console.log({ allLines });
          allLines.transition().duration(200).attr("opacity", 1).ease();
          startEnd
            .transition()
            .duration(200)
            .delay(200)
            .attr("opacity", 0.15)
            .ease();
          select(this).style(
            "background-color",
            (d: DGEventComparisonDataset) => d.color,
          );
        }
      })
      .on("mouseover", function (event, d) {
        const notData = datasets
          .filter((da) => da.id !== d.id)
          .map((d) => `#${d.id}`)
          .join();

        const notItems = selectAll(notData);
        notItems
          .transition()
          .duration(200)
          .style("filter", "saturate(0) opacity(40%) ")
          .ease();
      })
      .on("mouseout", function (event, d) {
        const notData = datasets
          .filter((da) => da.id !== d.id)
          .map((d) => `#${d.id}`)
          .join();

        const notItems = selectAll(notData);
        notItems
          .transition()
          .duration(200)
          .style("filter", "saturate(1) opacity(100%) ")
          .ease();
      });

    selectionBox.html(
      (d) => `
      <div class="title">${d.key}</div>
      <table class="site--details">
        <tbody>
        <tr class="table--header">
            <th>KWH</th>
            <th>Setpoint</th>
            <th>Fan</th>
        </tr>
        <tr class="table--body" id="table-values--${d.id}">
            <td>--</td>
            <td>--</td>
            <td>--</td>
        </tr>
        </tbody>
    </table>`,
    );

    const legend = svg.selectAll("legendBox").data([1]).enter().append("g");

    const LEGEND_OFFSET_Y = 75;
    const LEGEND_OFFSET_X = 65;
    legend
      .append("line")
      .attr("x1", 0 + LEGEND_OFFSET_X) // x position of the first end of the line
      .attr("y1", height + LEGEND_OFFSET_Y) // y position of the first end of the line
      .attr("x2", 30 + LEGEND_OFFSET_X) // x position of the second end of the line
      .attr("y2", height + LEGEND_OFFSET_Y)
      .attr("stroke", "white")
      .attr("stroke-dasharray", "10 3")
      .attr("stroke-width", "2px");

    legend
      .append("text")
      .text("kwh")
      .attr("fill", "white")
      .attr("y", height + LEGEND_OFFSET_Y + 4)
      .attr("x", LEGEND_OFFSET_X + 40);

    legend
      .append("line")
      .attr("x1", 100 + LEGEND_OFFSET_X) // x position of the first end of the line
      .attr("y1", height + LEGEND_OFFSET_Y) // y position of the first end of the line
      .attr("x2", 130 + LEGEND_OFFSET_X) // x position of the second end of the line
      .attr("y2", height + LEGEND_OFFSET_Y)
      .attr("stroke", "white")
      .attr("stroke-width", "2px");

    legend
      .append("text")
      .text("Setpoint")
      .attr("fill", "white")
      .attr("y", height + LEGEND_OFFSET_Y + 4)
      .attr("x", LEGEND_OFFSET_X + 140);

    const tracer = chartG.append("g");

    const tracerLine = tracer
      .append("rect")
      .attr("class", "track-line")
      .attr("height", height)
      .attr("width", 0.6)
      .attr("fill", "white")
      .attr("y", 0)
      .attr("x", -100);

    const tracerTextBg = tracer
      .append("rect")
      .attr("fill", "var(--zen-blue)")
      .attr("ry", 3)
      .attr("width", 80)
      .attr("height", 30)
      .attr("y", -20)
      .attr("x", -width);

    const tracerText = tracer
      .append("text")
      .attr("fill", "white")
      .attr("text-anchor", "middle")
      .attr("x", tracerLine.attr("x"))
      .attr("y", 0);

    chartG
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("cursor", "crosshair")
      .attr("fill", "rgba(0,0,0,0)")
      .on("mousemove", function (event) {
        const mousePosition = pointer(event);
        const hoveredDate = xScale.invert(mousePosition[0]);

        const getDistanceFromHoveredDate = (d) =>
          Math.abs((xAccessor(d) as any) - (hoveredDate as any));

        const closestIndex =
          leastIndex(data, (a, b) => {
            return (
              getDistanceFromHoveredDate(a) - getDistanceFromHoveredDate(b)
            );
          }) ?? 0;

        const closestDataPoint = data[closestIndex];

        // const closestXValue = dateFormat(d.timeset);
        tracerTextBg.attr("x", mousePosition[0] - 40);
        tracerLine.attr("x", mousePosition[0]);
        tracerText
          .attr("x", mousePosition[0])
          .text(closestDataPoint?.Time ?? "");
        const allDataAtTime = data.filter(
          (d) => d.Time == closestDataPoint?.Time ?? "",
        );

        updateSiteBoxes(allDataAtTime, data);
        // updateLegendText(closestDataPoint);

        return;
      });
  };
  //  json("../../data/dg-many-events.json").then((d) => {
  //   render(d.data);
  // });
  render(manyEvents.data as unknown as DGSiteEventDataPoint[]);
}

function updateSiteBoxes(siteArray, data) {
  selectAll(".table--body").html(`<td>--</td>
      <td>--</td>
      <td>--</td>`);

  siteArray.forEach((site) => {
    const values = selectAll(`#table-values--${site.SiteId}`);

    const dataValues = data.filter(
      (d) => d.SiteId === site.SiteId && d.Time === site.Time,
    )[0];

    values.html(
      `<td>${dataValues.EnergyUsage}</td>
         <td>${dataValues.SetPoint}</td>
         <td>${dataValues.Fan}</td>`,
    );
  });
}

// tryAgain();
