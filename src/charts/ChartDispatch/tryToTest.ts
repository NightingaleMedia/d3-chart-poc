import { ChartDispatch } from "./ChartDispatch";
import { getChartImpl } from "./ChartMap";

const CHART_ID = `sigman-bar`;
const DIV_ID = `test-element`;
const myDiv = document.createElement("div");
document.lastChild?.appendChild(myDiv);
myDiv.id = DIV_ID;

console.log(myDiv);
myDiv.dataset.fakeData = JSON.stringify({ test: 1, another: 2 });

setInterval(() => {
  myDiv.dataset.fakeData = JSON.stringify({
    test: Math.random(),
    another: Math.random(),
  });
}, 2000);

export const callChartFromBlazor = () => {
  const d = new ChartDispatch({
    chartName: "energySiteBreakdownChart",
    id: CHART_ID,
    dataElementId: DIV_ID,
    chartBase: getChartImpl("energySiteBreakdownChart"),
  });
};

export {};
