export enum ColorAccessor {
  ENERGY_LINE_COLOR = 'ENERGY_LINE_COLOR',
  AMBIENT_TEMP_COLOR = 'AMBIENT_TEMP_COLOR',
  HEATING_TEMP_COLOR = 'HEATING_TEMP_COLOR',
  COOLING_TEMP_COLOR = 'COOLING_TEMP_COLOR',
  FAN_COLOR = 'FAN_COLOR',
  AXIS_COLOR = 'AXIS_COLOR',
  AXIS_LABEL_COLOR = 'AXIS_LABEL_COLOR',
}
const getColor = (accessor: ColorAccessor) =>
  ({
    ENERGY_LINE_COLOR: 'var(--zss-energy-line)',
    AMBIENT_TEMP_COLOR: 'var(--zss-setpoint-line)',
    HEATING_TEMP_COLOR: 'var(--zss-error)',
    COOLING_TEMP_COLOR: 'var(--zss-blue)',
    FAN_COLOR: 'var(--zss-green)',
    AXIS_COLOR: 'var(--zss-chart-axis-line)',
    AXIS_LABEL_COLOR: 'white',
  }[accessor]);

export default getColor;
