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
      da.earlyMonth === da.latestMonth && da.latestDay - da.earlyDay <= 2,
    diff: da.latestDay - da.earlyDay,
    ...da,
  };
};
export const generateSummaryChart = () => {
  var svg = d3.select("svg.energy-breakdown"),
    margin = { top: 50, right: 50, bottom: 30, left: 50 },
    tooltipHeight = 110,
    tooltipWidth = svg.attr("width") - margin.left - margin.right,
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom - tooltipHeight;
  svg.attr("viewBox", [0, 0, width, height]);

  function render(data) {
    // Transform data
    data.forEach(function (d, i) {
      d.index = i;
      const parseTime = d3.timeParse("%m-%d-%Y %H:%M");
      d.timeset = parseTime(d.time);
    });

    const dataXrange = d3.extent(data, function (d) {
      return d.timeset;
    });

    const x = d3.scaleTime().domain(dataXrange).range([0, width]).nice();

    const y = d3.scaleLinear().range([0, height]).domain([0, 100]);

    const xAxis = (g, x) => {
      const { isGranular } = getGranular(x);
      g.attr("transform", `translate(0, ${height - margin.bottom})`).call(
        d3
          .axisBottom()
          .scale(x)
          .tickSize(5)
          .ticks(isGranular ? d3.timeMinute.every(60) : 10)
          .tickFormat((d, i) => {
            if (isGranular) {
              const hourFormat = d3.timeFormat("%-I%p");
              return hourFormat(d);
            }
            const f = d3.timeFormat("%-m/%d");

            // console.log(Number(f(x.domain()[1])) - Number(f(x.domain()[0])));
            // if (Number(f(x.domain()[1])) - Number(f(x.domain()[0])) < 3) {
            //   const hourFormat = d3.timeFormat("%I:%M");
            //   return hourFormat(d);
            // }
            // const f = d3.timeFormat("%-m/%d %I:%M");
            return f(d);
          }),
      );
      g.selectAll(".tick text, .tick line")
        .attr("fill", "white")
        .attr("stroke", "white");
    };
    const yAxis = (g, y) => {
      g.attr("transform", `translate(${margin.left}, ${-margin.top})`).call(
        d3
          .axisLeft()
          .scale(y)
          .tickSize(-width + 70)
          .ticks(3),
      );
      g.selectAll(".tick text, .tick line")
        .attr("fill", "white")
        .attr("stroke", "rgba(80,80,80,0.4)");

      g.selectAll(".tick text").attr("transform", "translate(-10,0)");
    };

    const x1MonthAxis = (g, x) => {
      const { isGranular } = getGranular(x);
      g.attr("class", "xMonthAxis")
        .attr("transform", `translate(${0}, ${-50})`)
        .call(
          d3
            .axisTop()
            .scale(x)
            .ticks(isGranular ? d3.timeHour.every(6) : d3.timeMonth)
            .tickFormat(
              isGranular ? d3.utcFormat("%-m/%d") : d3.utcFormat("%B %Y"),
            )
            .tickSize(-height - margin.bottom - margin.top + 80),
        );

      g.selectAll(".tick line")
        .attr("stroke-width", 1)
        .attr("stroke-opacity", 1)
        .attr("stroke", "rgba(255,255,255,0.3)")
        .style("font-size", "14px");

      g.selectAll(".tick text")
        .attr("fill", "white")
        // .attr("stroke", "white")
        .attr("opacity", "1")
        .attr("text-anchor", "start")
        .attr("transform", "translate(10,-5)")
        .style("font-size", "1rem");

      g.selectAll(".domain").remove();
    };
    const mx = svg.append("g").call(x1MonthAxis, x);
    const gx = svg.append("g").call(xAxis, x);
    const gy = svg.append("g").call(yAxis, y);

    const area = (data, x) =>
      d3
        .area()
        .x((d) => x(d.timeset))
        .y0(y(0))
        .y1((d) => y(d.usage))(data);

    const bars = (g, dx) => {
      console.log(dx.ticks().length);
      console.log(dx.ticks().length);
      // const { isGranular } = getGranular(x);
      g.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("height", (d) => y(d.usage))
        .attr("class", "data-bars")
        .attr("width", 1)
        .attr("fill", "white")
        .attr("y", (d) => height - margin.bottom - y(d.usage))
        .attr("x", (d) => dx(d.timeset));
    };
    const zoom = d3
      .zoom()
      .scaleExtent([1, data.length / 8])
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
      mx.call(x1MonthAxis, xz);
      gx.call(xAxis, xz);

      svg.call(bars, xz);
      svg
        .selectAll(".data-bars")
        .attr("fill", "var(--zen-blue)")
        .attr("x", (d) => x(d.timeset))
        .attr("width", 1);
    }

    svg
      .call(zoom)
      .transition()
      .duration(750)
      .call(zoom.scaleTo, 4, [x(data[data.length - 1].timeset), 0]);
  }

  d3.json("../data/energyUsage.json").then((d) => render(d.data));
};
