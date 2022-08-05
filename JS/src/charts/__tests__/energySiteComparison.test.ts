import energyChildren from "../../data/energySiteBreakdown.json";
import { callChartFromBlazor } from "../ChartDispatch";
import { setupTestDivs, testMap } from "./setup.test";
export const testEnergySiteComparison = (options: any) => {
  console.log({ energyChildren });
  const myDiv = setupTestDivs(testMap.energySiteComparison.divId);
  myDiv.dataset.chartData = JSON.stringify(energyChildren);

  if (options.callChart) {
    callChartFromBlazor(
      "energySiteComparison",
      testMap.energySiteComparison.chartId,
      testMap.energySiteComparison.divId,
    );
  }
};
