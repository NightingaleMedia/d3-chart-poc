import { callChartFromBlazor } from "../ChartDispatch";
import { setupTestDivs, testMap } from "./setup.test";
import deviceData from "../../data/device-data-report.json";
export const testDeviceData = (options) => {
    const myDiv = setupTestDivs(testMap.deviceDataReport.divId);
    myDiv.dataset.chartData = JSON.stringify(deviceData);
    if (options.callChart) {
        callChartFromBlazor("deviceDataReport", testMap.deviceDataReport.chartId, testMap.deviceDataReport.divId);
    }
};
//# sourceMappingURL=deviceDataReport.test.js.map