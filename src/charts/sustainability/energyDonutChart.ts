import Chart, { ChartConfiguration } from "chart.js/auto";

const data = {
  labels: ["Carbon", "Solar", "Wind", "Other"],
  datasets: [
    {
      label: "Dataset 1",
      data: [255, 30, 65, 22],
      backgroundColor: ["#5b5341", "#f6ad34", "#00cb30", "grey"],
      borderColor: "black",
    },
  ],
};

const config: ChartConfiguration = {
  type: "doughnut",
  data: data,
  options: {
    responsive: true,

    plugins: {
      title: {
        display: false,
        text: "Chart.js Doughnut Chart",
      },
      legend: {
        display: false,
      },
    },
  },
};
export const generateDonutEnergyChart = (svgId: string = "", data) => {
  console.log("chart donut...");

  let ctx = document.getElementById(svgId) as HTMLCanvasElement;
  ctx = ctx.getContext("2d") as any;
  const myChart = new Chart(ctx, config);
  //   myChart.show();
};
