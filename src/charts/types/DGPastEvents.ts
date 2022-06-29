import { DGEventType, DGEventBase } from "./DGEvents";

export type DGPastEvent = {
  Date: string;
  UtilityDR: PastEventChild[] | [];
  AbnormallyHot: PastEventChild[] | [];
  AbnormallyCold: PastEventChild[] | [];
  RoomRefresh: PastEventChild[] | [];
  GreenEnergy: PastEventChild[] | [];
};

export type PastEventChild = {
  id: number;
  groupId: string;
  dateTimeFrom: Date;
  dateTimeTo: Date;
  type: DGEventType;
};

export interface DGPastEventDataItem extends DGPastEvent {
  index: number;
  timeset: Date;
}

export type DGFlatDataItem = {
  Date: string;
  id: number;
  // Needs to be string because scale band accepts string
  keyIndex: string;
  type: DGEventType;
  timeset: Date;
  count: number;
  events: PastEventChild[];
};

export type DGColors = {
  fanColor: string;
  kwhColor: string;
  setpointColor: string;
  timeColor: string;
};
