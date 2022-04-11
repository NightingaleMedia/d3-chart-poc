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
      da.earlyMonth === da.latestMonth && da.latestDay - da.earlyDay <= 3,
    diff: da.latestDay - da.earlyDay,
    ...da,
  };
};
export const generateSummaryChart = () => {
  var svg = d3.select("svg.energy-breakdown"),
    margin = { top: 30, right: 50, bottom: 30, left: 50 },
    tooltipHeight = 80,
    tooltipWidth = svg.attr("width") - margin.left - margin.right,
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom - tooltipHeight;
  svg.attr("viewBox", [0, 0, width, height]);

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

    const x = d3
      .scaleTime()
      .domain(dataXrange)
      .range([width / data.length / 2, width - width / data.length / 2])
      .nice();

    const y = d3.scaleLinear().range([0, -height]).domain(rolledYRange);

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
            return f(d);
          }),
      );
      g.selectAll(".tick text, .tick line")
        .attr("fill", "white")
        .attr("stroke", "none");
    };
    const yAxis = (g, y) => {
      g.attr(
        "transform",
        `translate(${margin.left}, ${-margin.top + height})`,
      ).call(
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
      g.attr("class", "xMonthAxis").call(
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
    const mx = svg.append("g").call(x1MonthAxis, x);
    const gx = svg.append("g").call(xAxis, x);
    const gy = svg.append("g").call(yAxis, y);

    const bars = svg
      .append("g")
      .attr("class", "data-bars")
      .selectAll("rect")
      .data(rolledData)
      .enter()
      .append("rect");

    const granBars = svg
      .append("g")
      .attr("class", "data-bars")
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect");

    const zoom = d3
      .zoom()
      .scaleExtent([1, data.length])
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
      const { earlyMonth, latestMonth } = {
        earlyMonth: Date.parse(new Date(xz.domain()[0])),
        latestMonth: Date.parse(new Date(xz.domain()[1])),
      };

      const datamin = data.findIndex((d) => d.dateNum > earlyMonth);
      const datamax = data.findIndex((d) => d.dateNum > latestMonth);

      if (isGranular) {
        // gy.call(yAxis, y);
        // svg.selectAll("rect").exit().remove(bars);
        bars.attr("fill", "none");
        granBars
          .attr("x", (d) => {
            let len = d3.timeHour.offset(d.timeset, 1);
            // console.log(x(next));
            len = xz(len) - xz(d.timeset);
            len = len * 0.6;
            return xz(d.timeset) - len / 2;
          })
          .attr("y", (d) => y(d.usage) + height - margin.bottom)
          .attr("width", (d) => {
            let len = d3.timeHour.offset(d.timeset, 1);
            // console.log(x(next));
            len = xz(len) - xz(d.timeset);
            len = len * 0.6;
            return len;
          })
          .attr("fill", (d) =>
            d.usage > threshold.hourly
              ? "var(--zen-warning)"
              : "var(--zen-blue)",
          )
          .attr("height", (d) => -y(d.usage));
      } else {
        // gy.call(yAxis, y);
        granBars.attr("fill", "none");
        bars
          .attr("height", (d) => -y(d.usage))
          .attr("width", (d) => {
            let len = d3.timeDay.offset(d.timeset, 1);
            // console.log(x(next));
            len = xz(len) - xz(d.timeset);
            len = len * 0.6;
            return len;
          })
          .attr("y", (d) => y(d.usage) + height - margin.bottom)
          .attr("x", (d) => {
            let len = d3.timeDay.every(1).offset(d.timeset, 1);
            // console.log(x(next));
            len = xz(len) - xz(d.timeset);
            len = len * 0.6;
            return xz(d.timeset) - len / 2;
          })
          .attr("fill", (d) =>
            d.usage > threshold.daily
              ? "var(--zen-warning)"
              : "var(--zen-blue)",
          );
      }
    }

    svg
      .call(zoom)
      .transition()
      .duration(750)
      .call(zoom.scaleTo, 4, [x(data[data.length - 1].timeset), 0]);
  }

  d3.json("../data/energyUsage.json").then((d) => render(d.data, d.threshold));
};
