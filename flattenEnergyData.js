export function flattenData(data) {
  return data.reduce((arr, item) => {
    item = item.children.map((child, i) => {
      return {
        SiteName: item.SiteName,
        ChildName: child.SiteName,
        KwH: child.KwH,
        index: i,
      };
    });
    return [...item, ...arr];
  }, []);
}
