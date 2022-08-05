export function makeXAxis(appendTo, caller, height) {
  appendTo.append("g").call(caller).attr("transform", `translate(0, ${height - 20})`).attr("stroke", "var(--zss-chart-axis-text)").call((g) => {
    g.selectAll(".tick line").attr("transform", `translate(5, 15)`).attr("stroke-width", "1").attr("stroke", "var(--zss-chart-axis-line)");
    g.selectAll(".tick text").attr("transform", `translate(0, 5)`).attr("fill", "white").attr("stroke", "none").attr("font-size", "1rem");
    g.selectAll(".tick:first-of-type line, .tick:last-of-type line, .tick:first-of-type text, .tick:last-of-type text").attr("transform", `translate(5, 30)`).attr("opacity", 0).attr("stroke", "none");
  }).select(".domain").remove();
}
export function makeYAxis(appendTo, caller) {
  appendTo.append("g").attr("class", "x axis").style("text-anchor", "start").style("font-size", "16px").call(caller).call((g) => {
    g.selectAll(".domain").attr("fill", "none").attr("stroke", "none");
    g.selectAll(".tick line").attr("stroke-width", "0").attr("stroke", "white");
    g.selectAll(".tick text").attr("fill", "var(--zss-chart-axis-text)").attr("transform", "translate(10,-33)");
  });
}
