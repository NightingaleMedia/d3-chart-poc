import {select} from "../../../_snowpack/pkg/d3.js";
import {transformData} from "./utils/transformData.js";
import {getMode} from "./utils/getMode.js";
import moment from "../../../_snowpack/pkg/moment.js";
import {getOutOfRange} from "./utils/getOutOfRange.js";
export function generateDeviceDataTable(svgId, dataObject) {
  let data = dataObject.data;
  const TABLE_WRAP = select(`#${svgId}.device-data__table--wrap`);
  const getUtc = (value) => moment.utc(value).toDate();
  const constructedData = transformData(data[0]);
  const deviceData = constructedData.data.sort((a, b) => a.timestamp - b.timestamp).map((d, i) => {
    return {
      index: i,
      timeset: getUtc(d.timestamp) ?? new Date(),
      ...d
    };
  });
  const TABLE_BODY = TABLE_WRAP.select(`.table__body`);
  deviceData.forEach((d) => {
    const outOfRange = getOutOfRange(d);
    const className = outOfRange ? `table__row outOfRange` : `table__row`;
    const TABLE_ROW = TABLE_BODY.append(`div`).attr("class", className).attr("id", `timestamp--${d.timestamp}`);
    TABLE_ROW.html(`
    <div class="table__body--cell">${moment.utc(d.timeset).format(`hh:mm:ssa z`)}</div>
    <div class="table__body--cell localTemperature">${d.localTemperature}</div>
    <div class="table__body--cell coolingSetpoint">${d.coolingSetpoint}</div>
    <div class="table__body--cell heatingSetpoint">${d.heatingSetpoint}</div>
    <div class="table__body--cell mode center">${getMode(d.mode)}  </div>
    <div class="table__body--cell modeNum center">${d.mode}</div>
    `);
  });
}
