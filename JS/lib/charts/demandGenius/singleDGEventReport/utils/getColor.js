export var ColorAccessor;
(function (ColorAccessor) {
    ColorAccessor["ENERGY_LINE_COLOR"] = "ENERGY_LINE_COLOR";
    ColorAccessor["AMBIENT_TEMP_COLOR"] = "AMBIENT_TEMP_COLOR";
    ColorAccessor["OUTDOOR_TEMP_COLOR"] = "OUTDOOR_TEMP_COLOR";
    ColorAccessor["SETPOINT_LINE_COLOR"] = "SETPOINT_LINE_COLOR";
    ColorAccessor["FAN_COLOR"] = "FAN_COLOR";
    ColorAccessor["AXIS_COLOR"] = "AXIS_COLOR";
    ColorAccessor["AXIS_LABEL_COLOR"] = "AXIS_LABEL_COLOR";
})(ColorAccessor || (ColorAccessor = {}));
const getColor = (accessor) => ({
    ENERGY_LINE_COLOR: "var(--zss-energy-line)",
    AMBIENT_TEMP_COLOR: "var(--zss-blue)",
    OUTDOOR_TEMP_COLOR: "var(--zss-warning)",
    SETPOINT_LINE_COLOR: "var(--zss-setpoint-line)",
    FAN_COLOR: "var(--zss-blue)",
    AXIS_COLOR: "var(--zss-chart-axis-line)",
    AXIS_LABEL_COLOR: "white",
}[accessor]);
export default getColor;
//# sourceMappingURL=getColor.js.map