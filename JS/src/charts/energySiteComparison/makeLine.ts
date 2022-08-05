import {
  AxisScale,
  curveLinear,
  curveStep,
  line,
  ScaleLinear,
  ScaleTime,
  Selection,
} from "d3";
import { SiteUsage } from "../types/EnergySiteComparison";

type MakeLine__Props = {
  data: any[];
  xScale: ScaleTime<any, any, any>;
  y: ScaleLinear<any, any, any>;
  color: string;
  selector: Selection<SVGGElement, unknown, HTMLElement, any>;
  className: string;
  id: string;
  groupId: string;
};
// ENERGY LINE
export const makeLine = ({
  data,
  xScale,
  y,
  color,
  selector,
  className,
  id,
  groupId,
}: MakeLine__Props) => {
  const energyLine = line()
    .curve(curveStep)
    .x((d: any | SiteUsage) => {
      return xScale(d.timeset);
    })
    .y((d: any | SiteUsage) => {
      return -y(d.usage) - 35;
    });

  selector
    .append("path")
    .attr("clip-path", `url(#${groupId})`)
    .datum(data)
    .attr("class", className)
    .attr("id", id)
    .attr("d", energyLine)
    .attr("stroke", color)
    .attr("fill", "none");
};
