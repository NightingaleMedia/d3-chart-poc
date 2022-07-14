export function flattenData(data) {
  return data.reduce((arr, item) => {
    item.children.sort(function(a, b) {
      return a.KwH - b.KwH;
    });
    item = item.children.map((child, i) => {
      return {
        id: child.id,
        parentId: item.id,
        SiteName: item.SiteName,
        ChildName: child.SiteName,
        KwH: child.KwH,
        index: i,
        children: []
      };
    });
    return [...item, ...arr];
  }, []);
}
