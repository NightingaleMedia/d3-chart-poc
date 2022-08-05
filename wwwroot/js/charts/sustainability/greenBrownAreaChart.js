import Chart from "../../_snowpack/pkg/chartjs/auto.js";
import moment from "../../_snowpack/pkg/moment.js";
import {getVariableValue} from "../../utils/getVariableValue.js";
const getConfig = ({brownEnergy, greenEnergy}) => {
  return {
    type: "line",
    data: {
      datasets: [
        {
          label: "Green Energy",
          data: greenEnergy,
          backgroundColor: getVariableValue("--zss-green"),
          pointStyle: "line",
          fill: true,
          tension: 2e-3,
          stepped: true
        },
        {
          label: "Carbon Energy",
          data: brownEnergy,
          backgroundColor: getVariableValue("--zss-brown"),
          pointStyle: "line",
          fill: true,
          tension: 2e-3,
          stepped: true
        }
      ]
    },
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
};
let myChart;
export const generateGreenBrownAreaChart = (canvasId, data) => {
  let ctx = document?.getElementById(canvasId);
  ctx = ctx.getContext("2d");
  myChart = new Chart(ctx, getConfig(data));
};
