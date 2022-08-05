export const oldTypes = [
    "UtilityDR",
    "AbnormallyHot",
    "AbnormallyCold",
    "RoomRefresh",
    "GreenEnergy",
];
export const getNewTypeFromOld = (value) => {
    const v = {
        UtilityDR: "drEvent",
        AbnormallyHot: "weatherEvent--warm",
        AbnormallyCold: "weatherEvent--cold",
        RoomRefresh: "roomRefresh",
        GreenEnergy: "greenEnergy",
    };
    return v[value];
};
export const getDisplayNameFromType = (type) => ({
    drEvent: "Demand Response Event",
    "weatherEvent--warm": "Warm Weather Event",
    "weatherEvent--cold": "Cold Weather Event",
    greenEnergy: "Green Energy Event",
    roomRefresh: "Room Refresh Event",
}[type]);
//# sourceMappingURL=dgEventMap.js.map