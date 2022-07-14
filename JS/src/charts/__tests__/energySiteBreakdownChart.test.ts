import energyChildren from "../../data/energyChildren.json";
import { callChartFromBlazor } from "../ChartDispatch";
import { setupTestDivs, testMap } from "./setup.test";
export const testEnergySiteBreakdown = (options: any) => {
  const myDiv = setupTestDivs(testMap.energyBreakdown.divId);
  myDiv.dataset.chartData = JSON.stringify(energyChildren);

  const updateData = () => {
    energyChildren.data.forEach((site) => {
      let total = 0;
      site.children.forEach((child) => {
        const value = Math.ceil(Math.random() * 100);
        child.KwH = value;
        total += value;
      });
      site.KwH = total;
      site.SiteName = `${Math.ceil(Math.random() * 100)}--site`;
    });
    myDiv.dataset.chartData = JSON.stringify(energyChildren);
  };

  updateData();
  setInterval(updateData, 10000);

  if (options.callChart) {
    callChartFromBlazor(
      "energySiteBreakdownChart",
      testMap.energyBreakdown.chartId,
      testMap.energyBreakdown.divId,
    );
  }
};
