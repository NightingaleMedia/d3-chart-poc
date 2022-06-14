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
  parentId?: string;
}
export interface EnergySiteChildDataItem extends EnergySiteDataItem {
  ChildName: string;
}
