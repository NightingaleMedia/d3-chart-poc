export type DGPastEvent = {
  Date: string;
  UtilityDR: PastEventChild[] | [];
  AbnormallyHot: PastEventChild[] | [];
  AbnormallyCold: PastEventChild[] | [];
  RoomRefresh: PastEventChild[] | [];
  GreenEnergy: PastEventChild[] | [];
};

export interface DGPastEventDataItem extends DGPastEvent {
  index: number;
  timeset: Date;
}
export type Test = {
  hasDone: boolean;
};
export type DGFlatDataItem = {
  Date: string;
  id: number;
  // Needs to be string because scale band accepts string
  keyIndex: string;
  type: DGEventType;
  timeset: Date;
  count: number;
};

export type PastEventChild = {
  id: number;
  type: DGEventType;
};

export enum DGEventType {
  UtilityDR = "UtilityDR",
  AbnormallyHot = "AbnormallyHot",
  AbnormallyCold = "AbnormallyCold",
  RoomRefresh = "RoomRefresh",
  GreenEnergy = "GreenEnergy",
}
