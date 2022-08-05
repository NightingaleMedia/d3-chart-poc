const ModeMap = {
  0: 'Off',
  1: 'On',
  2: 'Cool',
  3: 'Heat',
  4: 'Emer',
  5: 'Auto',
  6: 'Unknown',
  7: 'Eco',
  8: 'Zen',
  9: 'Fan',
  10: 'Invalid',
  11: 'Emergency Heating',
  12: 'false',
};
export const getMode = (modeNumber: number): string => ModeMap[modeNumber];
