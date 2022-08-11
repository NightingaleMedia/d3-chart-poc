import moment from "../_snowpack/pkg/moment.js";
export const colorDates = (data) => {
  const dateArray = data.reduce((arr, item) => {
    return [...arr, new Date(item.dateTimeFrom)];
  }, []);
  dateArray.forEach((d) => {
    const formattedDate = moment(d).format("dddd, DD MMMM YYYY");
    const elem = document.querySelector(`[aria-label='${formattedDate}']`);
    elem?.classList.add("has-items");
  });
};
