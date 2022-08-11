export const getOutOfRange = (d) => {
  if (d.mode == 2) {
    if (d.localTemperature - d.coolingSetpoint > 5) {
      return true;
    }
  }
  if (d.mode == 3) {
    if (d.heatingSetpoint - d.localTemperature > 5) {
      return true;
    }
  }
  return false;
};
