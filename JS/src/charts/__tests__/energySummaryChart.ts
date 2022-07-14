import { callChartFromBlazor } from "../ChartDispatch";
import { setupTestDivs, testMap } from "./setup.test";

export const testEnergySummary = (options: any) => {
  const myDiv = setupTestDivs(testMap.energySummary.divId);

  const updateData = async () => {
    console.log("updating test energy summary");
    const newData = await fetch(
      "https://zen-fake-backend.herokuapp.com/energy/628eb63b796cba0007244c65",
    ).then((res) => res.json());

    console.log({ newData });
    myDiv.dataset.chartData = JSON.stringify(newData.energyData);
  };

  updateData();
  setInterval(updateData, 50000);

  if (options.callChart) {
    callChartFromBlazor(
      "energySummaryChart",
      testMap.energySummary.chartId,
      testMap.energySummary.divId,
    );
  }
};
