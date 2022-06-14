import { EnergySiteChildDataItem } from "../types/EnergySiteBreakdown";

export function flattenData(data): EnergySiteChildDataItem[] {
  return data.reduce((arr, item) => {
    // Sort Children
    item.children.sort(function (a, b) {
      return a.KwH - b.KwH;
    });

    // bundle children to flat with index by kwh
    item = item.children.map((child, i) => {
      return {
        id: child.id,
        parentId: item.id,
        SiteName: item.SiteName,
        ChildName: child.SiteName,
        KwH: child.KwH,
        index: i,
        children: [],
      };
    });
    return [...item, ...arr];
  }, []);
}
