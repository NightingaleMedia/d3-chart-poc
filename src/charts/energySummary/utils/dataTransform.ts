import {
  EnergySiteBreakdownResponse,
  EnergySiteChild,
  EnergySiteDataItem,
} from "../../types/EnergySiteBreakdown";
import { flattenData } from "./flattenEnergyData";

export const getDatasets = (initialData: EnergySiteBreakdownResponse) => {
  const jsonData: EnergySiteChild[] = initialData.data;

  const groupData: EnergySiteDataItem[] = jsonData.map((d, i) => ({
    ...d,
    index: i,
  }));

  const flatData = flattenData(groupData);

  return { flatData, groupData, jsonData };
};

export const getDataSum = (d: EnergySiteDataItem) =>
  d.children?.reduce((num, item) => (num = item.KwH + num), 0);
