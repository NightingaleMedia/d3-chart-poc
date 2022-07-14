import {
  ChartConfiguration,
  ChartData,
  ChartDataset,
  TimeScale,
} from "chart.js";
import Chart from "chart.js/auto";
import moment from "moment";

import { getBrownData, getGreenData } from "./utils/getData";

var datasets: ChartDataset[] = [
  {
    label: "Carbon Energy",
    data: getBrownData() as any,
    backgroundColor: "#5b5341",
    pointStyle: "line",
    fill: true,
    tension: 0.02,
    // stepped: true,
  },
  {
    label: "Green Energy",
    data: getGreenData() as any,
    backgroundColor: "#7fbc40",
    pointStyle: "line",
    fill: true,
    tension: 0.02,
    // stepped: true,
  },
];

const data: ChartData = {
  datasets,
};

const config: ChartConfiguration = {
  type: "line",
  data: data,

  options: {
    responsive: true,
    plugins: {
      title: {
        display: false,
        text: "Energy Green vs. Brown",
      },
      tooltip: {
        mode: "index",
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: true,
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
        ticks: {
          maxTicksLimit: 20,
          callback: function (val, index) {
            // Hide every 2nd tick label

            return moment(this.getLabelForValue(Number(val))).format("M/D");
          },
        },
      },
      y: {
        min: 0,
        stacked: true,
        title: {
          display: true,
          text: "kWh",
        },
      },
    },
  },
};
let myChart;
export const generateBrownAreaChart = (canvasId) => {
  let ctx = document?.getElementById(canvasId) as HTMLCanvasElement;
  ctx = ctx.getContext("2d") as any;
  myChart = new Chart(ctx, config);
  //   myChart.show();
};
