import Chart from "../../_snowpack/pkg/chartjs/auto.js";
const data = {
  labels: ["Carbon", "Solar", "Wind", "Other"],
  datasets: [
    {
      label: "Dataset 1",
      data: [255, 30, 65, 22],
      backgroundColor: ["#5b5341", "#f6ad34", "#00cb30", "grey"],
      borderColor: "black"
    }
  ]
};
const config = {
  type: "doughnut",
  data,
  options: {
    responsive: true,
    plugins: {
      title: {
        display: false,
        text: "Chart.js Doughnut Chart"
      },
      legend: {
        display: false
      }
    }
  }
};
export const generateDonutEnergyChart = (svgId = "", data2) => {
  console.log("chart donut...");
  let ctx = document.getElementById(svgId);
  ctx = ctx.getContext("2d");
  const myChart = new Chart(ctx, config);
};
