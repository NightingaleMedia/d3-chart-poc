import ChartBase from './ChartBase';

export type ChartName =
  | 'dgSingleReportChart'
  | 'pastDGEventChart'
  | 'dgManyReportChart'
  | 'energySummaryChart'
  | 'energySiteBreakdownChart'
  // | "brownAreaChart"
  | 'energyDonutChart'
  | 'peakPerformanceChart'
  | 'engagementChart'
  | 'deviceDataReport'
  | 'energySiteComparison'
  | 'greenEngagement'
  | 'siteEnergyUsage'
  | 'greenBrownAreaChart';

export type ChartMap = {
  [k in ChartName]: ChartBase;
};
