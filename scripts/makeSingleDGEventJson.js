const csv = require("csvtojson");
const fs = require("fs");
csv()
  .fromFile("../data/demand-genius.csv")
  .then(async (jsonObj) => {
    const makePrototype = (index, type) => {
      let arr = [];
      for (let i = 0; i <= index; i++) {
        arr.push({
          id: i,
          type,
        });
      }
      return arr;
    };
    jsonObj.forEach((obj) => {
      Object.keys(obj).map((key) => {
        if (["EnergyUsage", "SetPoint", "Fan", "AmbientTemp"].includes(key))
          obj[key] = Number(obj[key]);
        if (key === "EventWindow")
          obj[key] = obj[key] === "TRUE" ? true : false;
      });
      obj["TempScale"] = "F";
    });

    console.log(jsonObj);
    await fs.writeFileSync("dg-single-event.json", JSON.stringify(jsonObj));
  });
