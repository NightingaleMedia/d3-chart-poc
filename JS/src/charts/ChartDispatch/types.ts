import ChartBase from "./ChartBase";

export type ChartName =
  | "dgSingleReportChart"
  | "pastDGEventChart"
  | "dgManyReportChart"
  | "energySummaryChart"
  | "energySiteBreakdownChart"
  // | "brownAreaChart"
  // | "energyDonutChart"
  | "deviceDataReport"
  | "energySiteComparison";

export type ChartMap = {
  [k in ChartName]: ChartBase;
};
