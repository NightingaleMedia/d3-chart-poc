import { callChartFromBlazor } from '../ChartDispatch';
import { setupTestDivs, testMap } from './setup.test';
export const makeDgEventReport = (options) => {
    const myDiv = setupTestDivs(testMap.dgEventReport.divId);
    myDiv.dataset.chartData = JSON.stringify({ test: 'data' });
    if (options.callChart) {
        callChartFromBlazor('dgSingleReportChart', testMap.dgEventReport.chartId, testMap.dgEventReport.divId);
    }
};
//# sourceMappingURL=demandGeniusReport.test.js.map