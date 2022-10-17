const csv = require("csvtojson");
const fs = require("fs");
csv()
  .fromFile("../data/ZenPalette.csv")
  .then(async (jsonObj) => {
    const theme = {};
    await Promise.all(jsonObj.map((j) => (theme[j.ColorName] = j)));
    // jsonObj.forEach((j) => (theme[j] = jsonObj[j]));
    console.log({ theme });
    // await fs.writeFileSync("default-theme.json", JSON.stringify(theme));
    await fs.writeFileSync(
      "theme-colors.json",
      JSON.stringify(Object.keys(theme)),
    );
  });
