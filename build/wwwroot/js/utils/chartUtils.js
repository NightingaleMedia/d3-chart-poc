import {
  timeHour,
  timeDay,
  timeFormat,
  timeMonth
} from "../_snowpack/pkg/d3.js";
export const getXWidth = (d, xz, type, isGranular) => {
  const initial = isGranular ? timeHour.offset(d.timeset ?? new Date(), 1) : timeDay.offset(d.timeset ?? new Date(), 1);
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
export const getGranular = (x) => {
  const pd = timeFormat("%Y%j");
  const earliest = new Date(x.domain()[0]);
  const latest = new Date(x.domain()[1]);
  const da = {
    earlyMonth: Number(earliest.getMonth()),
    earlyDay: Number(pd(x.domain()[0])),
    latestMonth: Number(latest.getMonth()),
    latestDay: Number(pd(x.domain()[1]))
  };
  const returnValue = {
    isGranular: da.latestDay - da.earlyDay <= 8,
    diff: da.latestDay - da.earlyDay,
    ...da
  };
  return returnValue;
};
export function getXMonthTicks(isGranular) {
  if (isGranular) {
    return timeHour.every(24);
  }
  return timeMonth;
}
export function getXTicks(diff, isGranular) {
  if (isGranular) {
    if (diff <= 8 && diff > 3) {
      return timeHour.every(6);
    }
    if (diff <= 3 && diff > 1) {
      return timeHour.every(2);
    } else
      return timeHour;
  } else {
    return 10;
  }
}
