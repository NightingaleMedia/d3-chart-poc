import dgData from "../data/dg-events.json";
import moment from "moment";
export const colorDates = (jsonStringData) => {
    const data = JSON.parse(jsonStringData);
    const dateArray = data.reduce((arr, item) => {
        return [...arr, new Date(item.dateTimeFrom)];
    }, []);
    dateArray.forEach((d) => {
        const formattedDate = moment(d).format("dddd, DD MMMM YYYY");
        console.log({ formattedDate });
        const elem = document.querySelector(`[aria-label='${formattedDate}']`);
        elem === null || elem === void 0 ? void 0 : elem.classList.add("has-items");
    });
};
colorDates(JSON.stringify(dgData.data));
//# sourceMappingURL=colorDates.js.map