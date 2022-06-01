import { DGEventType, OldDGType } from "../../types/DGEvents";
import { DGFlatDataItem, DGPastEventDataItem } from "../../types/DGPastEvents";

import { getNewTypeFromOld, oldTypes } from "./dgEventMap";

export const flattenData = (data: DGPastEventDataItem[]) => {
  const allData: Array<DGFlatDataItem> = [];
  const keys: OldDGType[] = oldTypes;
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
          keyIndex: String(keyIndex + otherEvents),
          type: getNewTypeFromOld(key),
          timeset: d.timeset,
          count: d[key].length,
        });
      }
    });
  });
  return allData;
};
