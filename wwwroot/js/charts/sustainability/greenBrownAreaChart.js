import Chart from "../../_snowpack/pkg/chartjs/auto.js";
import moment from "../../_snowpack/pkg/moment.js";
import {getBrownData, getGreenData} from "./utils/getData.js";
var datasets = [
  {
    label: "Carbon Energy",
    data: getBrownData(),
    backgroundColor: "#5b5341",
    pointStyle: "line",
    fill: true,
    tension: 0.02
  },
  {
    label: "Green Energy",
    data: getGreenData(),
    backgroundColor: "#7fbc40",
    pointStyle: "line",
    fill: true,
    tension: 0.02
  }
];
const data = {
  datasets
};
const config = {
  type: "line",
  data,
  options: {
    responsive: true,
    plugins: {
      title: {
        display: false,
        text: "Energy Green vs. Brown"
      },
      tooltip: {
        mode: "index"
      }
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: true
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date"
        },
        ticks: {
          maxTicksLimit: 20,
          callback: function(val, index) {
            return moment(this.getLabelForValue(Number(val))).format("M/D");
          }
        }
      },
      y: {
        min: 0,
        stacked: true,
        title: {
          display: true,
          text: "kWh"
        }
      }
    }
  }
};
let myChart;
export const generateBrownAreaChart = (canvasId) => {
  let ctx = document?.getElementById(canvasId);
  ctx = ctx.getContext("2d");
  myChart = new Chart(ctx, config);
};
