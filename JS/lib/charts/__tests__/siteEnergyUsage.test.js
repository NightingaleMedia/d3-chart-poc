import { callChartFromBlazor } from '../ChartDispatch';
import { setupTestDivs, testMap } from './setup.test';
import data from '../../data/energyChildren.json';
export const testSiteEnergyUsage = (options) => {
    const myDiv = setupTestDivs(testMap.siteEnergyUsage.divId);
    myDiv.dataset.chartData = JSON.stringify(data.data);
    if (options.callChart) {
        callChartFromBlazor('siteEnergyUsage', testMap.siteEnergyUsage.chartId, testMap.siteEnergyUsage.divId);
    }
};
//# sourceMappingURL=siteEnergyUsage.test.js.map