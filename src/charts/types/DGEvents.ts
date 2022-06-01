export type DGEventBase = {
  id: string;
  groupId: string;
  type: DGEventType;
  dateTimeFrom: string;
  dateTimeTo: string;
  isEnabled: boolean;
  isRecurring: boolean;
};

export type DGEventType =
  | "drEvent"
  | "weatherEvent--warm"
  | "weatherEvent--cold"
  | "greenEnergy"
  | "roomRefresh";

export type OldDGType =
  | "UtilityDR"
  | "AbnormallyHot"
  | "AbnormallyCold"
  | "RoomRefresh"
  | "GreenEnergy";
