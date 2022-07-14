import {line} from "../../_snowpack/pkg/d3.js";
export const makeLine = ({
  data,
  xScale,
  y,
  color,
  selector,
  className
}) => {
  const energyLine = line().x((d) => {
    return xScale(d.timeset);
  }).y((d) => {
    return -y(d.usage) - 35;
  });
  selector.append("path").datum(data).attr("class", className).attr("d", energyLine).attr("stroke", color).attr("fill", "none");
};
