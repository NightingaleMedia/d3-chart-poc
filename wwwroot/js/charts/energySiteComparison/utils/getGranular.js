import {timeFormat, timeHour} from "../../../_snowpack/pkg/d3.js";
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
    isGranular: da.latestDay - da.earlyDay <= 14,
    diff: da.latestDay - da.earlyDay,
    ...da
  };
  return returnValue;
};
export function getXTicks(diff, isGranular) {
  if (isGranular) {
    if (diff <= 14 && diff > 8) {
      return timeHour.every(12);
    }
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
