import {
  curveStep,
  line
} from "../../_snowpack/pkg/d3.js";
export const makeLine = ({
  data,
  xScale,
  y,
  color,
  selector,
  className,
  id,
  groupId
}) => {
  const energyLine = line().curve(curveStep).x((d) => {
    return xScale(d.timeset);
  }).y((d) => {
    return -y(d.usage) - 35;
  });
  selector.append("path").attr("clip-path", `url(#${groupId})`).datum(data).attr("class", className).attr("id", id).attr("d", energyLine).attr("stroke", color).attr("fill", "none");
};
