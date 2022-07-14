export type EnergySummaryResponse = {
  data: EnergySummaryTimeset[];
  threshold: { hourly: number; daily: number };
};

export type EnergySummaryTimeset = {
  usage: number;
  time: string;
};

export type EnergySummaryMetadata = {
  threshold: { hourly: number; daily: number };
};

export interface AggregateDataItem extends TimeSeriesDataItem {
  index: number;
  day: string;
  usage: number;
}

export interface EnergySummaryDataItem extends TimeSeriesDataItem {
  index: number;
  dayOfYear: string;
  dateNum: number;
  usage: number;
  time: string;
}
