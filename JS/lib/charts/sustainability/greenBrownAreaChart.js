import Chart from 'chart.js/auto';
import moment from 'moment';
import { getVariableValue } from '../../utils/getVariableValue';
const getConfig = ({ brownEnergy, greenEnergy }) => {
    return {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'Green Energy',
                    data: greenEnergy,
                    backgroundColor: getVariableValue('--zss-green'),
                    pointStyle: 'line',
                    fill: true,
                    tension: 0.002,
                    stepped: true,
                },
                {
                    label: 'Carbon Energy',
                    data: brownEnergy,
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
    let ctx = document === null || document === void 0 ? void 0 : document.getElementById(canvasId);
    ctx = ctx.getContext('2d');
    myChart = new Chart(ctx, getConfig(data));
};
//# sourceMappingURL=greenBrownAreaChart.js.map