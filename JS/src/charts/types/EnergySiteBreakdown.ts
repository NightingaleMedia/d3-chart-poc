export type EnergySiteBreakdownResponse = {
  data: EnergySiteChild[];
  threshold: number;
};

export type EnergySiteChild = {
  id: string;
  title: string;
  parentId?: string;
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
