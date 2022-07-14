export type DeviceReportDataPoint = {
  timestamp: EpochTimeStamp;
  coolingSetpoint: number;
  heatingSetpoint: Number;
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
  mode: any;
};

export interface DeviceReportDataPointItem extends DeviceReportDataPoint {
  timeset: Date;
  index: number;
}
