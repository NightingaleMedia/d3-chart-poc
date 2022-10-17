declare interface ConsumerScheduleEntry {
  type: 'schedule';
  id: string;
  templateId: null;
  days:
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday'[];
  start: number;
  end: number;
  coolingSetpoint: number;
  heatingSetpoint: number;
  mode: any;
  fanMode: any;
  groupId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  ghost: boolean;
  groupLevel: number;
  groupTitle: string;
}

declare interface ConsumerScheduleItem {
  name:
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday';
  schedules: {
    index: number;
    start: number;
    end: number;
    hourStart: number;
    hourEnd: number;
    coolingSetpoint: number;
    heatingSetpoint: number;
    mode: any;
    id: any;
  }[];
}
