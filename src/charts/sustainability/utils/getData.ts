import greenData from "../../../data/greenEnergyUsage.json";

export const getBrownData = () => {
  let result = greenData.data.filter((d) => d.type === "brown");

  result = result.map((r) => ({
    x: r.time,
    y: r.usage,
    ...r,
  }));
  return result;
};

export const getGreenData = () => {
  const brownData = getBrownData();
  let result = greenData.data.filter((d) => d.type === "green");

  result = result.map((r, index) => ({
    x: r.time,
    y: r.usage,
    ...r,
  }));
  return result;
};
