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
      .fromFile(`../data/dg-sites/${s.file}`)
      .then((jsonObj) => {
        jsonObj.forEach((o) => (o.Site = s.name));
        jsonObj.forEach((o) => (o.EventWindow = o.IsRunning));
        mainObj.push(...jsonObj);
      });
  })
);

allObj.then(async (res) => {
  const groups = _.groupBy(mainObj, "Site");

  // console.log(groups);
  console.log(Object.keys(groups));
  // await fs.writeFileSync(
  //   "dg-many-events.json",
  //   JSON.stringify({ data: groups })
  // );
});

// console.log(allObj);
