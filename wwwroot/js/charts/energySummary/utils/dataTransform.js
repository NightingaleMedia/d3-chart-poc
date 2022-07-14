import {flattenData} from "./flattenEnergyData.js";
export const getDatasets = (initialData) => {
  const jsonData = initialData.data;
  const groupData = jsonData.map((d, i) => ({
    ...d,
    index: i
  }));
  const flatData = flattenData(groupData);
  return {flatData, groupData, jsonData};
};
export const getDataSum = (d) => d.children?.reduce((num, item) => num = item.KwH + num, 0);
