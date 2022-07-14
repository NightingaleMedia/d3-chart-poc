import { callChartFromBlazor } from "../ChartDispatch";
import { setupTestDivs, testMap } from "./setup.test";
import deviceData from "../../data/device-data-report.json";
export const testDeviceData = (options: any) => {
  const myDiv = setupTestDivs(testMap.deviceDataReport.divId);
  myDiv.dataset.chartData = JSON.stringify(deviceData.data);

  //   updateData();
  //   setInterval(updateData, 50000);

  if (options.callChart) {
    callChartFromBlazor(
      "deviceDataReport",
      testMap.deviceDataReport.chartId,
      testMap.deviceDataReport.divId,
    );
  }
};
