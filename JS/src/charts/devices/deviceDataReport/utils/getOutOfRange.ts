import { DeviceReportDataPointItem } from '../../../types/DeviceReport';

export const getOutOfRange = (d: DeviceReportDataPointItem): boolean => {
  if (d.mode == 2) {
    if (d.localTemperature - d.coolingSetPoint > 5) {
      return true;
    }
  }
  if (d.mode == 3) {
    if (d.heatingSetPoint - d.localTemperature > 5) {
      return true;
    }
  }
  return false;
};
