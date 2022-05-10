import { AxisScale, line, ScaleLinear, ScaleTime, Selection } from "d3";
import { SiteUsage } from "../types/EnergySiteComparison";

type MakeLine__Props = {
  data: any[];
  xScale: ScaleTime<any, any, any>;
  y: ScaleLinear<any, any, any>;
  color: string;
  selector: Selection<SVGGElement, unknown, HTMLElement, any>;
  className: string;
};
// ENERGY LINE
export const makeLine = ({
  data,
  xScale,
  y,
  color,
  selector,
  className,
}: MakeLine__Props) => {
  const energyLine = line()
    .x((d: any | SiteUsage) => {
      return xScale(d.timeset);
    })
    .y((d: any | SiteUsage) => {
      return -y(d.usage) - 35;
    });

  selector
    .append("path")
    .datum(data)
    .attr("class", className)
    .attr("d", energyLine)
    .attr("stroke", color)
    .attr("fill", "none");
};
