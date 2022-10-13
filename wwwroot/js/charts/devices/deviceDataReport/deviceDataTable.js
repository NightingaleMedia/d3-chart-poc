import {select} from "../../../_snowpack/pkg/d3.js";
import {getMode} from "./utils/getMode.js";
import moment from "../../../_snowpack/pkg/moment.js";
import {getOutOfRange} from "./utils/getOutOfRange.js";
export function generateDeviceDataTable(svgId, dataObject) {
  let data = dataObject[0];
  const TABLE_WRAP = select(`#${svgId}.device-data__table--wrap`);
  const getUtc = (value) => moment.utc(value).toDate();
  const deviceData = data?.deviceReportDataPoints.sort((a, b) => a.timeStamp - b.timeStamp).map((d, i) => {
    return {
      index: i,
      timeset: getUtc(d.timeStamp) ?? new Date(),
      ...d
    };
  });
  const TABLE_BODY = TABLE_WRAP.select(`.table__body`);
  deviceData.forEach((d) => {
    const outOfRange = getOutOfRange(d);
    const className = outOfRange ? `table__row outOfRange` : `table__row`;
    const TABLE_ROW = TABLE_BODY.append(`div`).attr("class", className).attr("id", `timestamp--${d.timeStamp}`);
    TABLE_ROW.html(`
    <div class="table__body--cell">${moment.utc(d.timeset).format(`hh:mm:ssa z`)}</div>
    <div class="table__body--cell localTemperature">${d.localTemperature}</div>
    <div class="table__body--cell coolingSetpoint">${d.coolingSetPoint}</div>
    <div class="table__body--cell heatingSetpoint">${d.heatingSetPoint}</div>
    <div class="table__body--cell mode center">${getMode(d.mode)}  </div>
    <div class="table__body--cell modeNum center">${d.mode}</div>
    `);
  });
}
