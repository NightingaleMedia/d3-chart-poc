import { DGEventType, OldDGType } from "../../types/DGEvents";

export const oldTypes: OldDGType[] = [
  "UtilityDR",
  "AbnormallyHot",
  "AbnormallyCold",
  "RoomRefresh",
  "GreenEnergy",
];

type DgDto = {
  [k in OldDGType]: DGEventType;
};

export const getNewTypeFromOld = (value: OldDGType): DGEventType => {
  const v: DgDto = {
    UtilityDR: "drEvent",
    AbnormallyHot: "weatherEvent--warm",
    AbnormallyCold: "weatherEvent--cold",
    RoomRefresh: "roomRefresh",
    GreenEnergy: "greenEnergy",
  };
  return v[value];
};
