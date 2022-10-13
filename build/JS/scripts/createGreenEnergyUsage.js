const moment = require("moment");
const fs = require("fs");
function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var then = moment().hour(0).minute(0).subtract(30, "days");
var now = moment().date(8).hour(0).minute(0);

let hrs = [];

while (then.isBefore(now, "hours")) {
  // total for day should be 500 - 1000
  //   hour should be range 20 - 42

  hrs.push({
    type: "brown",
    usage: randomIntFromInterval(200, 250),
    time: then.format("MM-DD-YYYY HH:mm"),
  });
  hrs.push({
    type: "green",
    usage: randomIntFromInterval(20, 50),
    time: then.format("MM-DD-YYYY HH:mm"),
  });

  then.add(1, "hours");
}

const data = { data: hrs };

fs.writeFile("greenEnergyUsage.json", JSON.stringify(data), (err, file) => {
  console.log(file);
});
