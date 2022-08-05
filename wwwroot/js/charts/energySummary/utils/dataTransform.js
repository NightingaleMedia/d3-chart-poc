export const getDatasets = (initialData) => {
  const jsonData = initialData.data;
  const groupData = jsonData.map((d, i) => ({
    ...d,
    index: i
  })).sort((a, b) => b.KwH - a.KwH);
  const flatData = flattenData(groupData);
  return {flatData, groupData, jsonData, threshold: initialData.threshold};
};
export const getDataSum = (d) => d.children?.reduce((num, item) => num = item.KwH + num, 0);
export function flattenData(data) {
  return data.reduce((arr, item) => {
    item.children.sort(function(a, b) {
      return a.KwH - b.KwH;
    });
    item = item.children.map((child, i) => {
      return {
        id: child.id,
        parentId: item.id,
        title: item.title,
        ChildName: child.title,
        KwH: child.KwH,
        index: i,
        children: []
      };
    });
    return [...item, ...arr];
  }, []);
}
