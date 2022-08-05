import Chart from 'chart.js/auto';
import { getVariableValue } from '../../utils/getVariableValue';
const getConfig = (data) => {
    const fakeData = [
        {
            name: 'Natural Gas',
            value: 13301,
            color: getVariableValue('--zss-brown'),
            id: '1234',
        },
        {
            name: 'Solar',
            value: 11856,
            color: getVariableValue('--zss-dg-weatherEvent--warm'),
            id: '1234',
        },
        {
            name: 'Wind',
            value: 3286,
            color: getVariableValue('--zss-dg-weatherEvent--cold'),
            id: '1234',
            Wind: 65,
        },
        {
            name: 'Nuclear',
            value: 2261,
            color: getVariableValue('--zss-green'),
            id: '1234',
            Other: 22,
        },
        {
            name: 'Geothermal',
            value: 885,
            color: getVariableValue('--zss-dark-blue'),
            id: '1234',
            Other: 22,
        },
        {
            name: 'Other',
            value: 1700,
            color: getVariableValue('--zss-nominal'),
            id: '1234',
            Other: 22,
        },
    ];
    return {
        type: 'doughnut',
        data: {
            labels: fakeData.flatMap((d) => d.name),
            datasets: [
                {
                    label: 'Green Energy Breakdown',
                    data: fakeData.flatMap((d) => d.value),
                    backgroundColor: fakeData.flatMap((d) => d.color),
                    borderColor: 'rgba(0,0,0,0)',
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: false,
                    text: 'Chart.js Doughnut Chart',
                },
                legend: {
                    display: false,
                },
            },
        },
    };
};
export const generateEnergyDonutChart = (canvasId = '', data) => {
    console.log('chart donut...');
    let ctx = document.getElementById(canvasId);
    ctx = ctx.getContext('2d');
    const myChart = new Chart(ctx, getConfig(data));
};
//# sourceMappingURL=energyDonutChart.js.map