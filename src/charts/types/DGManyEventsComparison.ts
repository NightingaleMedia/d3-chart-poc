import { ScaleLinear, ScaleTime } from "d3";
import { DGColors } from "./DGPastEvents";
import { DGEventDataPoint } from "./DGSingleEvent";

export interface DGSiteEventDataPoint extends DGEventDataPoint {
  Site: string;
  SiteId: string;
}

export interface DGSiteEventDataPointDataItem extends DGSiteEventDataPoint {
  timeset: Date;
  index: number;
}
export type DGEventComparisonDataset = {
  color: string;
  colors: DGColors;
  id: string;
  key: string;
  values: DGSiteEventDataPointDataItem[];
};

export type MakeLines__Props = {
  data: DGSiteEventDataPointDataItem[];
  lineColor: string;
  siteName: string;
  colors: DGColors;
  id: string | number;
  height: string | number;
  kwhYScale: ScaleLinear<any, any, any>;
  kwhRange: number[];
  xScale: ScaleTime<any, any, any>;
  tempYScale: ScaleLinear<any, any, any>;
  fanScaleY: ScaleLinear<any, any, any>;
};
