import { group } from "d3";
import moment from "moment";
export const filterResponse = (dgResponseData) => {
    const allEvents = dgResponseData;
    const finalData = [];
    group(allEvents.data.map((e) => (Object.assign(Object.assign({}, e), { Date: moment(e.dateTimeFrom).format("MM/DD/YYYY") }))), (d) => d.Date).forEach(([...e], index) => finalData.push({
        Date: index,
        UtilityDR: e.filter((t) => t.type === "drEvent"),
        AbnormallyHot: e.filter((t) => t.type === "weatherEvent--warm"),
        AbnormallyCold: e.filter((t) => t.type === "weatherEvent--cold"),
        RoomRefresh: e.filter((t) => t.type === "roomRefresh"),
        GreenEnergy: e.filter((t) => t.type === "greenEnergy"),
    }));
    return finalData
        .filter((d, i) => moment(d.Date).isBefore(moment(new Date())))
        .filter((d) => moment(d.Date).dayOfYear() > moment(new Date()).dayOfYear() - 30);
};
//# sourceMappingURL=filterResponseToChartData.js.map