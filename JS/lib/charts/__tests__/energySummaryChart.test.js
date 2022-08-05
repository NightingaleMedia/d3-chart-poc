var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { callChartFromBlazor } from '../ChartDispatch';
import { setupTestDivs, testMap } from './setup.test';
export const testEnergySummary = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const myDiv = setupTestDivs(testMap.energySummary.divId);
    const myDiv2 = setupTestDivs(testMap.energySummary2.divId);
    const updateData = () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('updating test energy summary');
        const newData = yield fetch('https://zen-fake-backend.herokuapp.com/energy/628eb63b796cba0007244c65').then((res) => res.json());
        myDiv.dataset.chartData = JSON.stringify(newData.energyData);
        myDiv2.dataset.chartData = JSON.stringify(newData.energyData);
    });
    yield updateData();
    if (options.callChart) {
        callChartFromBlazor('energySummaryChart', testMap.energySummary.chartId, testMap.energySummary.divId);
        callChartFromBlazor('energySummaryChart', testMap.energySummary2.chartId, testMap.energySummary2.divId);
    }
});
//# sourceMappingURL=energySummaryChart.test.js.map