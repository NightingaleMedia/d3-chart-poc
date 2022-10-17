export type DeviceReportDataPoint = {
  timeStamp: string | EpochTimeStamp;
  coolingSetPoint: number;
  heatingSetPoint: number;
  fanMode?: any;
  dimmerLevel: any;
  humidity: any;
  localTemperature: number;
  relay: {
    G: boolean;
    W1: boolean;
    W2: boolean;
    Y: boolean;
    Y1: boolean;
  };
  mode: 0 | 1 | 2 | 3 | 4 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
};

declare interface DeviceActivityReport {
  device: {
    deviceId: string;
    title: string;
    type: string;
    sensor: string;
  };
  deviceReportDataPoints: DeviceReportDataPoint[];
}
export interface DeviceReportDataPointItem extends DeviceReportDataPoint {
  timeset: Date;
  index: number;
}
