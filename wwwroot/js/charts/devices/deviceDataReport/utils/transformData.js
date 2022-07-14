export const transformData = ({
  device,
  fields,
  values
}) => {
  const data = values.map((v, index) => {
    let singleValue = {};
    fields.forEach((f, index2) => {
      if (f == "relay") {
        singleValue[f] = {
          W1: v[index2].includes("W1"),
          W2: v[index2].includes("W2"),
          G: v[index2].includes("G"),
          Y1: v[index2].includes("Y1"),
          Y: v[index2].includes("Y")
        };
      } else
        singleValue[f] = v[index2];
    });
    return singleValue;
  });
  return {device, data};
};
