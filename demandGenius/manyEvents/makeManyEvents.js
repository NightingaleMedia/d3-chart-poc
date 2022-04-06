const makeTimeWindow = (selection, props) => {
  const { data, siteName, lineColor, height, kwhYScale, kwhRange, xScale, id } =
    props;

  const START_TIME_ENTRY = data.find((d) => {
    return d.EventWindow == true;
  });

  const END_TIME_ENTRY = data.find((d) => {
    return d.index > START_TIME_ENTRY.index && d.EventWindow == false;
  });

  //   MAKE START END
  const startEnd = selection
    .append("rect")
    .attr("class", `start-end--boundary`)
    .attr("id", id)
    .attr("fill", `${lineColor}`)
    .attr("opacity", 0.09)
    .attr("height", height - kwhYScale(kwhRange[1] - 20))
    .attr("width", () => {
      const start = xScale(START_TIME_ENTRY.timeset);
      const end = xScale(END_TIME_ENTRY.timeset);
      return end - start;
    })
    .attr("x", xScale(START_TIME_ENTRY.timeset))
    .attr("y", kwhYScale(kwhRange[1] - 20));
};

const makeLines = (selection, props) => {
  const {
    data,
    lineColor,
    id,
    height,
    kwhYScale,
    xScale,
    tempYScale,
    fanScaleY,
  } = props;

  // ENERGY LINE
  const energyLine = d3
    .line()
    .curve(d3.curveNatural)
    .x((d) => xScale(d.timeset))
    .y((d) => kwhYScale(d.EnergyUsage));

  // SETPOINT LINE
  const setpointLine = d3
    .line()
    .curve(d3.curveNatural)
    .x((d) => xScale(d.timeset))
    .y((d) => tempYScale(d.SetPoint));

  // FANLINE
  const fanLine = d3
    .line()
    .curve(d3.curveStep)
    .x((d) => xScale(d.timeset))
    .y((d) => {
      return -fanScaleY(d.Fan);
    });

  var area = d3
    .area()
    .x((d) => d.timeset)
    .y((d) => d.EnergyUsage);

  selection.append("path").datum(data).attr("d", area);

  // FANLINE
  selection
    .append("path")
    .datum(data)
    .attr("class", "fan-line")
    .attr("id", id)
    .attr("d", fanLine)
    .attr("stroke", lineColor)
    .attr("fill", "none")
    .attr("transform", `translate(0, ${height + 38})`);

  //   ENERGY LINE
  selection
    .append("path")
    .datum(data)
    .attr("class", "energy-line")
    .attr("id", id)
    .attr("d", energyLine)
    .attr("fill", "none")
    .attr("stroke", lineColor);

  //   SET LINE
  selection
    .append("path")
    .datum(data)
    .attr("class", "setpoint-line")
    .attr("id", id)
    .attr("d", setpointLine)
    .attr("fill", "none")
    .attr("stroke", lineColor);
};

export function makeManyEvents() {
  var svg = d3.select("svg.demand-genius--many"),
    margin = { top: 30, right: 20, bottom: 30, left: 20 },
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
      `translate(${margin.left + selectionWidth}, ${margin.top})`
    );

  const fullChart = chartG
    .append("g")
    .attr("height", height)
    .attr("width", chartWidth);
  // clipPath is used to keep line and area from moving outside of plot area when user zooms/scrolls/brushes

  const ENERGY_LINE_COLOR = "#38feaf";
  const SETPOINT_LINE_COLOR = "#fecc38";
  const FAN_COLOR = "steelBlue";

  const dateParser = d3.timeParse("%I:%M %p");
  const dateFormat = d3.timeFormat("%-I:%M %p");
  const xAccessor = (d) => {
    if (d) {
      const titleString = dateParser(d.Time);
      return titleString;
    }
  };

  const render = (data) => {
    // format month as a date
    data.forEach(function (d, i) {
      d.index = i;
      d.EventWindow = d.EventWindow.toLowerCase() == "true" ? true : false;
      d.timeset = dateParser(d.Time);
      d.siteId = btoa(d.Site);
    });

    var dataXrange = d3.extent(data, function (d) {
      return d.timeset;
    });

    var tempRange = [64, 79]; //TODO get a better range

    const kwhRange = [
      d3.min(data.map((d) => d.EnergyUsage)),
      d3.max(data.map((d) => d.EnergyUsage)),
    ];

    const xScale = d3
      .scaleTime()
      .domain(dataXrange)
      .range([0, chartWidth])
      .nice();

    const tempYScale = d3.scaleLinear().range([height, 0]).domain(tempRange);

    const kwhYScale = d3.scaleLinear().range([height, 0]).domain(kwhRange);

    const fanScaleY = d3
      .scaleLinear()
      .domain([0, 3])
      .range([40, height / 3]);

    // AXES
    var xAxis = d3
      .axisBottom()
      .scale(xScale)
      .tickSizeOuter(0)
      .tickFormat((d) => dateFormat(d));

    var yRightAxis = d3
      .axisRight()
      .scale(tempYScale)
      .ticks(10)
      .tickFormat((d) => d + "°")
      // .tickSize(-width)
      .tickSizeOuter(0);

    var yLeftAxis = d3
      .axisLeft()
      .scale(kwhYScale)
      .tickFormat((d) => d + " kwh")
      .ticks(9)
      .tickSize(-chartWidth + 28)
      .tickSizeOuter(0);

    chartG
      .append("g")
      .attr("class", "y axis right")
      .call(yRightAxis)
      .call((g) =>
        g
          .selectAll(".tick text")
          .attr("stroke-width", 0.2)
          .attr("stroke-opacity", 1)
          .attr("stroke", "white")
      )
      .call((g) => {
        g.selectAll(".tick line")
          .attr("stroke-width", 0)
          .attr("stroke-opacity", 0);
        g.selectAll(
          ".tick:last-of-type line, .tick:last-of-type text, .tick:first-of-type line, .tick:first-of-type text"
        )
          .attr("stroke-width", 0)
          .attr("stroke-opacity", 0)
          .attr("stroke", "white");
      })
      .attr("transform", `translate(${chartWidth - 28},0)`);

    // KWH axis
    chartG
      .append("g")
      .attr("class", "y axis left")
      .attr("transform", `translate(${30},0)`)
      .call(yLeftAxis)
      .call((g) =>
        g
          .selectAll(".tick line, .tick text")
          .attr("stroke-width", 0.5)
          .attr("stroke-opacity", 0.8)
          .attr("stroke", "white")
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

    chartG
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${height + 10})`)
      .call(xAxis)
      .call((g) =>
        g
          .selectAll(".tick line, .tick text")
          .attr("stroke-width", 0.3)
          .attr("stroke-opacity", 0.8)
          .attr("stroke", "white")
      );

    // Make data for each
    const datasets = d3
      .nest()
      .key((d) => d.Site)
      .entries(data);

    datasets.forEach((d, index) => {
      const colorDomain = d3
        .scaleLinear()
        .domain([0, datasets.length])
        .range([0, 1]);

      const color = d3.interpolateCool(colorDomain(index));
      d.color = color;
      d.id = btoa(d.key);
    });

    console.log({ datasets });
    datasets.forEach((d, index) => {
      const props = {
        data: d.values,
        id: d.id,
        lineColor: d.color,
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

    datasets.forEach((d, index) => {
      const props = {
        data: d.values,
        lineColor: d.color,
        siteName: d.key,
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

    const selectionBox = d3
      .select(".selection--wrap")
      .selectAll("div")
      .data(datasets)
      .enter()
      .append("div")
      .style("background-color", (d) => d.color)
      .style("cursor", "pointer")
      .style("color", "white")
      .attr("class", `site--selector`)
      .attr("id", (d) => d.id)
      .attr("data-selected", true)
      .on("click", function (d) {
        const allElems = d3.selectAll(`#${d.id}`);

        if (this.dataset.selected === "true") {
          this.dataset.selected = "false";
          allElems.transition().duration(200).attr("opacity", 0).ease();
          this.classList.add("deselected");
          d3.select(this).style("background-color", "unset");
        } else {
          this.dataset.selected = "true";
          this.classList.remove("deselected");
          const startEnd = d3.selectAll(`#${d.id}.start-end--boundary`);
          const allLines = d3.selectAll(`path#${d.id}`);
          console.log({ allLines });
          allLines.transition().duration(200).attr("opacity", 1).ease();
          startEnd
            .transition()
            .duration(200)
            .delay(200)
            .attr("opacity", 0.1)
            .ease();
          d3.select(this).style("background-color", (d) => d.color);
        }
      })
      .on("mouseover", function (d) {
        const notData = datasets
          .filter((da) => da.id !== d.id)
          .map((d) => `#${d.id}`)
          .join();

        const notItems = d3.selectAll(notData);
        notItems
          .transition()
          .duration(200)
          .style("filter", "saturate(0) opacity(40%) ")
          .ease();
      })
      .on("mouseout", function (d) {
        const notData = datasets
          .filter((da) => da.id !== d.id)
          .map((d) => `#${d.id}`)
          .join();

        const notItems = d3.selectAll(notData);
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
    </table>`
    );

    const legend = svg.selectAll("legendBox").data([1]).enter().append("g");

    const legendBox = legend
      .append("g")
      .attr("x", 0 + margin.left + selectionWidth)
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

    const tracer = chartG.append("g");

    const tracerLine = tracer
      .append("rect")
      .attr("class", "track-line")
      .attr("height", height)
      .attr("width", 1)
      .attr("stroke", "rgba(255,255,255,0.6)")
      .attr("stroke-width", 1)
      .attr("y", tempYScale(78));

    const tracerText = tracer
      .append("text")
      .attr("fill", "white")
      .attr("text-anchor", "middle")
      .attr("x", tracerLine.attr("x"));

    chartG
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("cursor", "crosshair")
      .attr("fill", "rgba(0,0,0,0)")
      .on("mousemove", function (d) {
        const mousePosition = d3.mouse(this);
        const hoveredDate = xScale.invert(mousePosition[0]);

        const getDistanceFromHoveredDate = (d) =>
          Math.abs(xAccessor(d) - hoveredDate);

        const closestIndex = d3.scan(data, (a, b) => {
          return getDistanceFromHoveredDate(a) - getDistanceFromHoveredDate(b);
        });

        const closestDataPoint = data[closestIndex];

        // const closestXValue = dateFormat(d.timeset);
        tracerLine.attr("x", d3.mouse(this)[0]);
        tracerText.attr("x", d3.mouse(this)[0]).text(closestDataPoint.Time);
        const allDataAtTime = data.filter(
          (d) => d.Time == closestDataPoint.Time
        );

        updateSiteBoxes(allDataAtTime, data);
        // updateLegendText(closestDataPoint);

        return;
      });
  };
  d3.json("../../data/dg-many-events.json", function (d) {
    render(d.data);
  });
}

function updateSiteBoxes(siteArray, data) {
  d3.selectAll(".table--body").html(`<td>--</td>
      <td>--</td>
      <td>--</td>`);

  siteArray.forEach((site) => {
    const values = d3.selectAll(`#table-values--${site.siteId}`);

    const dataValues = data.filter(
      (d) => d.siteId === site.siteId && d.Time === site.Time
    )[0];

    values.html(
      `<td>${dataValues.EnergyUsage}</td>
         <td>${dataValues.SetPoint}</td>
         <td>${dataValues.Fan}</td>`
    );
  });
}

// tryAgain();
