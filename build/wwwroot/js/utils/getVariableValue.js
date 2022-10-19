export const getVariableValue = (variableName) => {
  let value;
  value = getComputedStyle(document.documentElement).getPropertyValue(variableName);
  if (value)
    return value;
  return "#fff";
};
