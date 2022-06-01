import Chart from "chart.js/auto";
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
export const generateDonutEnergyChart = () => {
  console.log("chart donut...");
  const ctx = document?.getElementById("donut-energy-chart").getContext("2d");
  const myChart = new Chart(ctx, config);
  //   myChart.show();
};
