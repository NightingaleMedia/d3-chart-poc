export type DGEventDataPoint = {
  Time: string;
  EnergyUsage: number;
  SetPoint: Number;
  TempScale: "F" | "C";
  Fan: number;
  EventWindow: boolean;
  AmbientTemp: number;
};

export interface DGEventDataPointItem extends DGEventDataPoint {
  timeset: Date;
  index: number;
}

// "Time": "11:00 AM",
// "EnergyUsage": 200,
// "SetPoint": 72,
// "Fan": 1,
// "EventWindow": false,
// "AmbientTemp": 80
