import energyChildren from "../../data/energyChildren.json";
import { callChartFromBlazor } from "../ChartDispatch";
import { setupTestDivs, testMap } from "./setup.test";
export const testEnergySiteBreakdown = (options) => {
    const myDiv = setupTestDivs(testMap.energyBreakdown.divId);
    myDiv.dataset.chartData = JSON.stringify(energyChildren);
    if (options.callChart) {
        callChartFromBlazor("energySiteBreakdownChart", testMap.energyBreakdown.chartId, testMap.energyBreakdown.divId);
    }
};
//# sourceMappingURL=energySiteBreakdownChart.test.js.map