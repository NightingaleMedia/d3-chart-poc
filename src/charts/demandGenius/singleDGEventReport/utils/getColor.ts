export enum ColorAccessor {
  ENERGY_LINE_COLOR = "ENERGY_LINE_COLOR",
  AMBIENT_TEMP_COLOR = "AMBIENT_TEMP_COLOR",
  SETPOINT_LINE_COLOR = "SETPOINT_LINE_COLOR",
  FAN_COLOR = "FAN_COLOR",
  AXIS_COLOR = "AXIS_COLOR",
  AXIS_LABEL_COLOR = "AXIS_LABEL_COLOR",
}
const getColor = (accessor: ColorAccessor) =>
  ({
    ENERGY_LINE_COLOR: "#38feaf",
    AMBIENT_TEMP_COLOR: "tomato",
    SETPOINT_LINE_COLOR: "#fecc38",
    FAN_COLOR: "var(--zen-blue)",
    AXIS_COLOR: "rgba(255,255,255,0.1)",
    AXIS_LABEL_COLOR: "white",
  }[accessor]);

export default getColor;
