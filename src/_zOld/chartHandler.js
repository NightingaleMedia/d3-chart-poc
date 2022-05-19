const data1 = {
  labels: [1, 2, 3, 4, 5, 6, 7],
  datasets: [
    {
      label: "Dataset 1",
      data: [1, 2, 3, 4, 5, 6, 7],
      backgroundColor: "rgba(125,25,0,1)",
    },
    {
      label: "Dataset 2",
      data: [1, 2, 3, 4, 5, 6, 7],
      backgroundColor: "rgba(25,125,10,0.5)",
    },
    {
      label: "Dataset 3",
      data: [1, 2, 3, 4, 5, 6, 7],
      backgroundColor: "rgba(10,60,80,0.9)",
    },
  ],
};

const config = {
  type: "bar",
  data: data1,
  options: {
    plugins: {
      title: {
        display: true,
        text: "Chart.js Bar Chart - Stacked",
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  },
};

const dataToUse = {
  type: "bar",
  data: {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
};

function makeChart(id, data) {
  console.log("id: ", id);
  const ctx = document.getElementById(id).getContext("2d");

  const myChart = new Chart(ctx, data);
}
