import energyChildren from "../../data/energyChildren.json.proxy.js";
import {callChartFromBlazor} from "../ChartDispatch/index.js";
import {setupTestDivs, testMap} from "./setup.test.js";
export const testEnergySiteBreakdown = (options) => {
  const myDiv = setupTestDivs(testMap.energyBreakdown.divId);
  myDiv.dataset.chartData = JSON.stringify(energyChildren);
  if (options.callChart) {
    callChartFromBlazor("energySiteBreakdownChart", testMap.energyBreakdown.chartId, testMap.energyBreakdown.divId);
  }
};
