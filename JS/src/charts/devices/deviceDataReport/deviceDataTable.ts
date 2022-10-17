import { select } from 'd3';

import getColor, { ColorAccessor } from './utils/getColor';
import { transformData } from './utils/transformData';
import {
  DeviceActivityReport,
  DeviceReportDataPointItem,
} from '../../types/DeviceReport';
import { getMode } from './utils/getMode';
import moment from 'moment';
import { getOutOfRange } from './utils/getOutOfRange';

export function generateDeviceDataTable(
  svgId,
  dataObject: DeviceActivityReport[]
) {
  let data = dataObject[0];
  const TABLE_WRAP = select(`#${svgId}.device-data__table--wrap`);
  // clipPath is used to keep line and area from moving outside of plot area when user zooms/scrolls/brushes
  const getUtc = (value: number): Date => moment.utc(value).toDate();

  const deviceData: DeviceReportDataPointItem[] = data?.deviceReportDataPoints
    .sort((a, b) => (a.timeStamp as number) - (b.timeStamp as number))
    .map((d, i) => {
      return {
        index: i,
        timeset: getUtc(d.timeStamp as number) ?? new Date(),
        ...d,
      };
    }) as DeviceReportDataPointItem[];

  const TABLE_BODY = TABLE_WRAP.select(`.table__body`);

  deviceData.forEach((d) => {
    const outOfRange = getOutOfRange(d);

    const className = outOfRange ? `table__row outOfRange` : `table__row`;

    const TABLE_ROW = TABLE_BODY.append(`div`)
      .attr('class', className)
      .attr('id', `timestamp--${d.timeStamp}`);

    TABLE_ROW.html(`
    <div class="table__body--cell">${moment
      .utc(d.timeset)
      .format(`hh:mm:ssa z`)}</div>
    <div class="table__body--cell localTemperature">${d.localTemperature}</div>
    <div class="table__body--cell coolingSetpoint">${d.coolingSetPoint}</div>
    <div class="table__body--cell heatingSetpoint">${d.heatingSetPoint}</div>
    <div class="table__body--cell mode center">${getMode(d.mode)}  </div>
    <div class="table__body--cell modeNum center">${d.mode}</div>
    `);
  });
}
//  csv(demandGenius).then((d) => render(d));

// tryAgain();
