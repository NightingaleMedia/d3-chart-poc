import {
  EnergySiteBreakdownResponse,
  EnergySiteChild,
  EnergySiteChildDataItem,
  EnergySiteDataItem,
} from "../../types/EnergySiteBreakdown";

export const getDatasets = (initialData: EnergySiteBreakdownResponse) => {
  const jsonData: EnergySiteChild[] = initialData.data;
  const groupData: EnergySiteDataItem[] = jsonData
    .map((d, i) => ({
      ...d,
      index: i,
    }))
    .sort((a, b) => b.KwH - a.KwH);
  const flatData = flattenData(groupData);
  // flatData.sort((a, b) => a.KwH - b.KwH);

  return { flatData, groupData, jsonData, threshold: initialData.threshold };
};

export const getDataSum = (d: EnergySiteDataItem) =>
  d.children?.reduce((num, item) => (num = item.KwH + num), 0);

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
        title: item.title,
        ChildName: child.title,
        KwH: child.KwH,
        index: i,
        children: [],
      };
    });
    return [...item, ...arr];
  }, []);
}
