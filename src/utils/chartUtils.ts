import {
  timeHour,
  timeDay,
  timeFormat,
  AxisDomain,
  AxisScale,
  timeMonth,
} from "d3";
export const getXWidth = (
  d: TimeSeriesDataItem,
  xz: any,
  type: "x" | "width",
  isGranular: boolean,
): number => {
  const initial = isGranular
    ? timeHour.offset(d.timeset ?? new Date(), 1)
    : timeDay.offset(d.timeset ?? new Date(), 1);

  const len = (xz(initial) - xz(d.timeset)) * 0.6;

  let response;
  if (type === "x") {
    response = xz(d.timeset) - len / 2;
  }
  if (type === "width") {
    response = len;
  }
  return response ? response : 0;
};

// http://bl.ocks.org/adg29/8868399
export const getGranular = (x: AxisScale<any>): IsGranular => {
  const pd = timeFormat("%Y%j");

  const earliest = new Date(x.domain()[0]);
  const latest = new Date(x.domain()[1]);
  const da = {
    earlyMonth: Number(earliest.getMonth()),
    earlyDay: Number(pd(x.domain()[0])),
    latestMonth: Number(latest.getMonth()),
    latestDay: Number(pd(x.domain()[1])),
  };

  const returnValue = {
    isGranular: da.latestDay - da.earlyDay <= 8,
    diff: da.latestDay - da.earlyDay,
    ...da,
  };

  return returnValue;
};

export function getXMonthTicks(isGranular) {
  // let len = isGranular ? d3.timeHour.every(6) : d3.timeMonth;
  // return len;
  if (isGranular) {
    return timeHour.every(24);
  }
  return timeMonth;
}

export function getXTicks(diff, isGranular: boolean): any {
  if (isGranular) {
    if (diff <= 8 && diff > 3) {
      return timeHour.every(6);
    }
    if (diff <= 3 && diff > 1) {
      return timeHour.every(2);
    } else return timeHour;
  } else {
    return 10;
  }
}
