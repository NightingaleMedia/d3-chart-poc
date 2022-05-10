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
    .attr("stroke", "white")
    .call((g) => {
      g.selectAll(".tick line")
        .attr("transform", `translate(0, 10)`)
        .attr("stroke-width", 0.4)
        .attr("stroke-opacity", 0.5)
        .attr("stroke", "white");

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
    .style("text-color", "white")
    .style("fill", "none")
    .style("stroke", "#5A5A5A")
    .style("stroke-width", "0")
    .style("font-size", "16px")
    .attr("fill", "#5A5A5A")
    .attr("transform", "translate(10,-30)")
    .call(caller)
    .call((g) => g.selectAll(".tick text").attr("fill", "white"));
}
