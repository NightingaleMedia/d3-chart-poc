import {getNewTypeFromOld, oldTypes} from "./dgEventMap.js";
export const flattenData = (data) => {
  const allData = [];
  const keys = oldTypes;
  data.map((d, index) => {
    let keyIndex = 1;
    keys.map((key) => {
      const dt = [...allData];
      const otherEvents = dt.filter((ad) => ad.Date === d.Date).length;
      if (d[key].length > 0) {
        allData.push({
          Date: d.Date,
          id: Date.parse(d.Date) + index,
          events: d[key],
          keyIndex: String(keyIndex + otherEvents),
          type: getNewTypeFromOld(key),
          timeset: d.timeset,
          count: d[key].length
        });
      }
    });
  });
  return allData;
};
