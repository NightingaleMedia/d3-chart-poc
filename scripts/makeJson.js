const csv = require("csvtojson");
const fs = require("fs");
csv()
  .fromFile("../data/dg-past-events.csv")
  .then(async (jsonObj) => {
    const temp = jsonObj[0];

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
    jsonObj.forEach((ob) => {
      Object.keys(ob).map((key) => {
        if (key !== "Date") {
          if (Number(ob[key]) !== 0) {
            ob[key] = makePrototype(Number(ob[key]), key);
          } else {
            ob[key] = [];
          }
        }
      });
    });

    console.log(jsonObj);
    await fs.writeFileSync("dg-past-events.json", JSON.stringify(jsonObj));
  });
