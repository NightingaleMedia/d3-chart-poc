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
  | 'greenBrownAreaChart'
  | 'consumerScheduleTimeline';

export type ChartMap = {
  [k in ChartName]: ChartBase;
};
