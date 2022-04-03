import { eventTypes } from "./eventTypes.js";

export const flattenData = (data) => {
  const allData = [];
  const keys = Object.keys(data[0]).filter((d) => eventTypes.includes(d));
  data.map((d, index) => {
    let keyIndex = 1;

    keys.map((key) => {
      // if there are some events in there
      const dt = [...allData];
      const otherEvents = dt.filter((ad) => ad.Date === d.Date).length;
      //see if there is another for that day in our existing array

      if (d[key].length > 0) {
        allData.push({
          Date: d.Date,
          id: Date.parse(d.Date) + index,
          keyIndex: keyIndex + otherEvents,
          type: key,
          timeset: d.timeset,
          count: d[key].length,
        });
      }
    });
  });
  return allData;
};
