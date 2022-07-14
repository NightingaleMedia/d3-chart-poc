const moment = require("moment");
const fs = require("fs");

let sites = [
  { siteId: 1, siteName: "Chicago" },
  { siteId: 2, siteName: "New York" },
  { siteId: 3, siteName: "Los Angeles" },
  { siteId: 4, siteName: "Seattle" },
  { siteId: 5, siteName: "Detroit" },
  { siteId: 6, siteName: "Denver" },
];
function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var then = moment().hour(0).minute(0).subtract(120, "days");
var now = moment().date(8).hour(0).minute(0);

sites = sites.map((s) => {
  let hrs = [];
  while (then.isBefore(now, "hours")) {
    // total for day should be 500 - 1000
    //   hour should be range 20 - 42

    if (then.dayOfYear() === 60) {
      hrs.push({
        usage: 0,
        time: then.format("MM-DD-YYYY HH:mm"),
      });
    } else {
      hrs.push({
        usage: randomIntFromInterval(16, 50),
        time: then.format("MM-DD-YYYY HH:mm"),
      });
    }
    then.add(1, "hours");
  }
  then = moment().hour(0).minute(0).subtract(120, "days");
  now = moment().date(8).hour(0).minute(0);
  return { ...s, usage: hrs };
});

const data = { data: sites };

fs.writeFile("energySiteBreakdown.json", JSON.stringify(data), (err, file) => {
  console.log(file);
});
