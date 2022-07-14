export type EnergySiteComparisonResponse = {
  data: EnergySiteComparisonSite[];
};

export type EnergySiteComparisonSite = {
  siteId: number | string;
  siteName: string;
  usage: EnergySiteUsageSeries[];
};

type EnergySiteUsageSeries = {
  usage: number;
  time: string;
};

export interface SiteUsage extends TimeSeriesDataItem {
  usage: number;
  timeset: Date | null;
  //   day of year in the format <number of day 0-364>-<YYYY>
  dayOfYear: string;
  dateNum: number;
  siteName: string;
}

export interface EnergySiteUsageAggregate extends TimeSeriesDataItem {
  day: string;
  usage: number;
}
