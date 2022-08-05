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
export const testPeakPerformance = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const myDiv = setupTestDivs(testMap.peakChart.divId);
    const updateData = () => __awaiter(void 0, void 0, void 0, function* () {
        const newData = { percent: 50 };
        myDiv.dataset.chartData = JSON.stringify(newData);
    });
    yield updateData();
    if (options.callChart) {
        callChartFromBlazor('peakPerformanceChart', testMap.peakChart.chartId, testMap.peakChart.divId);
    }
});
//# sourceMappingURL=peakPerformance.test.js.map