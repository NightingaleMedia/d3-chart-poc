type IsGranular = {
  earlyMonth: number;
  earlyDay: number;
  latestMonth: number;
  latestDay: number;
  isGranular: boolean;
  diff: number;
};

interface TimeSeriesDataItem {
  timeset: Date | null;
}
