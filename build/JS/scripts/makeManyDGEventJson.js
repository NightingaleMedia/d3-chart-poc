const csv = require("csvtojson");
const fs = require("fs");
const _ = require("lodash");
const sites = [
  { name: "Site 1", file: "site1.csv" },
  { name: "Site 2", file: "site2.csv" },
  { name: "Site 3", file: "site3.csv" },
];
const mainObj = [];

const allObj = Promise.all(
  sites.map(async (s) => {
    await csv()
      .fromFile(`../src/data/dg-sites/${s.file}`)
      .then((jsonObj) => {
        jsonObj.forEach((o) => {
          o.Site = s.name;
          o["TempScale"] = "F";
          o.SiteId = Buffer.from(s.name).toString("base64");
          Object.keys(o).map((key) => {
            if (["EnergyUsage", "SetPoint", "Fan", "AmbientTemp"].includes(key))
              o[key] = Number(o[key]);
            if (key === "IsRunning")
              o["EventWindow"] = o["IsRunning"] === "TRUE" ? true : false;
          });
          delete o.IsRunning;
        });
        // jsonObj.forEach((o) => (o.EventWindow = o.IsRunning));
        mainObj.push(...jsonObj);
      });
  }),
);

allObj.then(async (res) => {
  const groups = _.groupBy(mainObj, "Site");

  console.log(groups);
  console.log(Object.keys(groups));

  await fs.writeFileSync(
    "dg-many-events.json",
    JSON.stringify({ data: mainObj }),
  );
});

// console.log(allObj);
