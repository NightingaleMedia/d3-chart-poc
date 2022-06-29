import { ChartDispatch } from "./ChartDispatch";
import { getChartImpl } from "./ChartMap";
import { ChartName } from "./types";
import energyChildren from "../../data/energyChildren.json";

const CHART_ID = `site-breakdown-chart`;
const DIV_ID = `test-element`;
const myDiv = document.createElement("div");
document.lastChild?.appendChild(myDiv);
myDiv.id = DIV_ID;

myDiv.dataset.fakeData = JSON.stringify(energyChildren);

console.log({ myDiv });
const updateData = () => {
  energyChildren.data.forEach((site) => {
    let total = 0;
    site.children.forEach((child) => {
      const value = Math.ceil(Math.random() * 100);
      child.KwH = value;
      total += value;
    });
    site.KwH = total;
  });
  myDiv.dataset.fakeData = JSON.stringify(energyChildren);
};
updateData();
setInterval(updateData, 5000);

export const callChartFromBlazor = (
  chartName: ChartName,
  CHART_ID,
  DATA_DIV_ID,
) => {
  new ChartDispatch({
    chartName: chartName,
    id: CHART_ID,
    dataElementId: DATA_DIV_ID,
    chartBase: getChartImpl(chartName),
  });
};

callChartFromBlazor("energySiteBreakdownChart", CHART_ID, DIV_ID);

export {};
