export type EnergySiteBreakdownResponse = {
  data: EnergySiteChild[];
};

export type EnergySiteChild = {
  id: string;
  SiteName: string;
  KwH: number;
  children?: EnergySiteChild[];
};

export interface EnergySiteDataItem extends EnergySiteChild {
  index: number;
}
export interface EnergySiteChildDataItem extends EnergySiteDataItem {
  ChildName: string;
}

// "id": "1",
// "SiteName": "Columbia",
// "KwH": 150,
// "children": [
//   { "id": "1.1", "SiteName": "Site1.1", "KwH": 50 },
//   { "id": "1.2", "SiteName": "Site1.2", "KwH": 80 },
//   { "id": "1.3", "SiteName": "Site1.3", "KwH": 10 },
//   { "id": "1.3", "SiteName": "Site1.4", "KwH": 10 }
// ]
