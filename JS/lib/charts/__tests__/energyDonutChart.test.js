import { callChartFromBlazor } from '../ChartDispatch';
import { getBrownData, getGreenData } from '../sustainability/utils/getData';
import { setupTestDivs, testMap } from './setup.test';
export const testEnergyDonutChart = (options) => {
    const brData = getBrownData();
    const grData = getGreenData();
    const myDiv = setupTestDivs(testMap.energyDonutChart.divId);
    myDiv.dataset.chartData = JSON.stringify({
        brownEnergy: brData,
        greenEnergy: grData,
    });
    if (options.callChart) {
        callChartFromBlazor('energyDonutChart', testMap.energyDonutChart.chartId, testMap.energyDonutChart.divId);
    }
};
//# sourceMappingURL=energyDonutChart.test.js.map