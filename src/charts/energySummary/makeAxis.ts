import { Selection } from "d3";
export function makeXAxis(
  appendTo: Selection<SVGGElement, unknown, HTMLElement, any>,
  caller: any,
  height: number,
) {
  appendTo
    .append("g")
    .call(caller)
    .attr("transform", `translate(0, ${height - 30})`)
    .attr("stroke", "var(--zss-chart-axis-text)")
    .call((g) => {
      g.selectAll(".tick line")
        .attr("transform", `translate(0, 10)`)
        .attr("stroke-width", "1")
        .attr("stroke", "var(--zss-chart-axis-line)");

      g.selectAll(
        ".tick:first-of-type line, .tick:last-of-type line, .tick:first-of-type text, .tick:last-of-type text",
      )
        .attr("transform", `translate(0, 10)`)
        .attr("opacity", 0)
        .attr("stroke", "none");
    })
    .select(".domain")
    .remove();
}
export function makeYAxis(
  appendTo: Selection<SVGGElement, unknown, HTMLElement, any>,
  caller: any,
) {
  appendTo
    .append("g")
    .attr("class", "x axis")
    .style("text-anchor", "start")
    .style("font-size", "16px")
    .attr("transform", "translate(10,-30)")
    .call(caller)
    .call((g) =>
      g.selectAll(".tick text").attr("fill", "var(--zss-chart-axis-text)"),
    );
}
