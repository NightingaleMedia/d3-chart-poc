import { DeviceActivityReport } from '../../../types/DeviceReport';

type SingleDeviceReport = {
  device: {
    deviceId: string;
    title: string;
    type: string;
    sensor: string;
  };
  fields: string[];
  values: string[] | any;
};

export const transformData = ({
  device,
  fields,
  values,
}: SingleDeviceReport): DeviceActivityReport => {
  const data: DeviceActivityReport['data'] = values.map((v, index) => {
    let singleValue = {};
    fields.forEach((f, index) => {
      if (f == 'relay') {
        singleValue[f] = {
          W1: v[index].includes('W1'),
          W2: v[index].includes('W2'),
          G: v[index].includes('G'),
          Y1: v[index].includes('Y1'),
          Y: v[index].includes('Y'),
        };
      } else singleValue[f] = v[index];
    });
    return singleValue;
  });

  return { device, data };
};
