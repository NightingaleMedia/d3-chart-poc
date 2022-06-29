import ChartBase from "./ChartBase";

export type ChartName =
  | "dgSingleReportChart"
  | "pastDGEventChart"
  | "dgManyReportChart"
  | "energySummaryChart"
  | "energySiteBreakdownChart"
  // | "brownAreaChart"
  // | "energyDonutChart"
  | "energySiteComparison";

export type ChartMap = {
  [k in ChartName]: ChartBase;
};
