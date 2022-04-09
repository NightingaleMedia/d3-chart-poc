import { flattenData } from "./energyBreakdown/flattenEnergyData.js";

export function tauChart(id) {
  d3.json("energyChildren.json", function (err, d) {
    const { data } = d;
    console.log(data);

    const chartData = flattenData(data);

    console.log(chartData);

    var chart = new Taucharts.Chart({
      type: "horizontal-stacked-bar",
      y: "SiteName",
      x: "KwH",
      plugins: [
        Taucharts.api.plugins.get("tooltip")({
          fields: ["ChildName", "KwH"],
          formatters: {
            ChildName: { label: "Site Name" },
            KwH: { label: "Est. Usage" },
          },
        }),
      ],
      data: chartData,
      guide: {
        color: {
          brewer: ["#181818"],
        },
      },
    });

    chart.renderTo(`#tauTest`);
  });
}

// tauChart();
