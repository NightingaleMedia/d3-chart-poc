const moment = require("moment");
const fs = require("fs");
function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var then = moment().hour(0).minute(0).subtract(120, "days");
var now = moment().date(8).hour(0).minute(0);

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

const data = { data: hrs, threshold: { hourly: 45, daily: 800 } };

fs.writeFile("energyUsage.json", JSON.stringify(data), (err, file) => {
  console.log(file);
});
