import {
  ChartConfiguration,
  ChartData,
  ChartDataset,
  TimeScale,
} from 'chart.js';
import Chart from 'chart.js/auto';
import moment from 'moment';
import { getVariableValue } from '../../utils/getVariableValue';
import { getBrownData, getGreenData } from './utils/getData';
const getConfig = ({ brownEnergy, greenEnergy }): ChartConfiguration => {
  return {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'Green Energy',
          data: getGreenData() as any,
          backgroundColor: getVariableValue('--zss-green'),
          pointStyle: 'line',
          fill: true,
          tension: 0.002,
          stepped: true,
        },
        {
          label: 'Carbon Energy',
          data: getBrownData() as any,
          backgroundColor: getVariableValue('--zss-brown'),
          pointStyle: 'line',
          fill: true,
          tension: 0.002,
          stepped: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: false,
          text: 'Energy Green vs. Brown',
        },
        tooltip: {
          mode: 'index',
        },
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: true,
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Date',
          },
          ticks: {
            maxTicksLimit: 20,
            callback: function (val, index) {
              // Hide every 2nd tick label

              return moment(this.getLabelForValue(Number(val))).format('M/D');
            },
          },
        },
        y: {
          min: 0,
          stacked: true,
          title: {
            display: true,
            text: 'kWh',
          },
        },
      },
    },
  };
};
let myChart;
export const generateGreenBrownAreaChart = (canvasId, data) => {
  let ctx = document?.getElementById(canvasId) as HTMLCanvasElement;
  ctx = ctx.getContext('2d') as any;
  myChart = new Chart(ctx, getConfig(data));
  //   myChart.show();
};
