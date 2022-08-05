export const getVariableValue = (variableName: string): string => {
  let value;
  value = getComputedStyle(document.documentElement).getPropertyValue(
    variableName
  );
  if (value) return value;
  return '#fff';
};
