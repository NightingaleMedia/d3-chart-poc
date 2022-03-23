export function makeXAxis(appendTo, caller, height) {
  appendTo
    .append("g")
    .call(caller)
    .attr("transform", `translate(0, ${height + 10})`)
    .attr("stroke", "white")
    .call((g) =>
      g
        .selectAll(".tick line")
        .attr("transform", `translate(0, 10)`)
        .attr("stroke-width", 0.4)
        .attr("stroke-opacity", 0.5)
        .attr("stroke", "white"),
    )
    .select(".domain")
    .remove();
}
export function makeYAxis(appendTo, caller) {
  appendTo
    .append("g")
    .attr("class", "x axis")
    .style("text-anchor", "start")
    .style("text-color", "white")
    .style("fill", "none")
    .style("stroke", "#5A5A5A")
    .style("stroke-width", "0px")
    .style("font-size", "16px")
    .attr("fill", "#5A5A5A")
    .attr("transform", "translate(10,-30)")
    .call(caller)
    .call((g) => g.selectAll(".tick text").attr("fill", "white"));
}
