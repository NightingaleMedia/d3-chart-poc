export var ColorAccessor;
(function(ColorAccessor2) {
  ColorAccessor2["ENERGY_LINE_COLOR"] = "ENERGY_LINE_COLOR";
  ColorAccessor2["AMBIENT_TEMP_COLOR"] = "AMBIENT_TEMP_COLOR";
  ColorAccessor2["HEATING_TEMP_COLOR"] = "HEATING_TEMP_COLOR";
  ColorAccessor2["COOLING_TEMP_COLOR"] = "COOLING_TEMP_COLOR";
  ColorAccessor2["FAN_COLOR"] = "FAN_COLOR";
  ColorAccessor2["AXIS_COLOR"] = "AXIS_COLOR";
  ColorAccessor2["AXIS_LABEL_COLOR"] = "AXIS_LABEL_COLOR";
})(ColorAccessor || (ColorAccessor = {}));
const getColor = (accessor) => ({
  ENERGY_LINE_COLOR: "var(--zss-energy-line)",
  AMBIENT_TEMP_COLOR: "var(--zss-setpoint-line)",
  HEATING_TEMP_COLOR: "var(--zss-error)",
  COOLING_TEMP_COLOR: "var(--zss-blue)",
  FAN_COLOR: "var(--zss-blue)",
  AXIS_COLOR: "var(--zss-chart-axis-line)",
  AXIS_LABEL_COLOR: "white"
})[accessor];
export default getColor;
