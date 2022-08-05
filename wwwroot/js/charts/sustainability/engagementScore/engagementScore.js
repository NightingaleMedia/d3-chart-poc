import {
  arc as dArc,
  format as dFormat,
  interpolate,
  pie as dPie,
  select
} from "../../../_snowpack/pkg/d3.js";
function calcPercent(percent) {
  return [percent, 100 - percent];
}
const LIGHT_GREEN = "#8cc63f";
const DARK_GREEN = "#009245";
let SVG;
let CHART_G;
export function makeEngagementChart(svgId, data = {percent: 35}) {
  var dataset = {
    lower: calcPercent(0),
    upper: calcPercent(data.percent)
  };
  SVG = select(`svg#${svgId}`);
  var margin = {left: 10, top: 0, bottom: 0, right: 10};
  var duration = 800;
  var width = SVG.attr("width") - margin.left - margin.right;
  var height = SVG.attr("height") - margin.top - margin.bottom;
  CHART_G = SVG.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")").attr("id", `chart-group--${svgId}`);
  var defs = SVG.append("defs");
  var greenGradient = defs.append("linearGradient").attr("id", "greenGradient").attr("x1", "0%").attr("x2", "100%").attr("y1", "0%").attr("y2", "100%");
  greenGradient.append("stop").attr("class", "start").attr("offset", "0%").attr("stop-color", DARK_GREEN).attr("stop-opacity", 1);
  greenGradient.append("stop").attr("class", "end").attr("offset", "100%").attr("stop-color", LIGHT_GREEN).attr("stop-opacity", 1);
  var redGradient = defs.append("linearGradient").attr("id", "redGradient").attr("x1", "0%").attr("x2", "100%").attr("y1", "0%").attr("y2", "100%");
  redGradient.append("stop").attr("class", "start").attr("offset", "0%").attr("stop-color", "var(--zss-error)").attr("stop-opacity", 1);
  redGradient.append("stop").attr("class", "end").attr("offset", "100%").attr("stop-color", "var(--zss-warning)").attr("stop-opacity", 1);
  var radius = Math.min(width, height) / 3, pie = dPie().sort(null), format = dFormat(".0%");
  var arc = dArc().innerRadius(radius * 0.6).outerRadius(radius);
  var lower_path = CHART_G.selectAll("path").data(pie(dataset.lower)).enter().append("path").attr("fill", (d, i) => ({
    0: (() => {
      if (data.percent < 50) {
        return `url(#redGradient)`;
      } else {
        return `url(#greenGradient)`;
      }
    })(),
    1: "var(--zss-chart-bg)"
  })[i]).attr("d", arc).each(function(d) {
    this._current = d;
  });
  var text = CHART_G.append("text").attr("text-anchor", "middle").attr("dy", ".3em").attr("fill", "white").attr("font-size", "1.75rem");
  var progress = 0;
  var timeout = setTimeout(function() {
    clearTimeout(timeout);
    lower_path = lower_path.data(pie(dataset.upper));
    lower_path.transition().duration(duration).attrTween("d", function(a) {
      var i = interpolate(this._current, a);
      var i2 = interpolate(progress, data.percent);
      this._current = i(0);
      return function(t) {
        text.text(format(i2(t) / 100));
        return arc(i(t));
      };
    });
  }, 200);
}
export const updateEngagementChart = (svgId, data) => {
  SVG.select(`#chart-group--${svgId}`).remove();
  makeEngagementChart(svgId, data);
};
