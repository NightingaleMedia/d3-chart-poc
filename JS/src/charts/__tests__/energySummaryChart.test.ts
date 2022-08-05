import { callChartFromBlazor } from '../ChartDispatch';
import { setupTestDivs, testMap } from './setup.test';

export const testEnergySummary = async (options: any) => {
  const myDiv = setupTestDivs(testMap.energySummary.divId);
  const myDiv2 = setupTestDivs(testMap.energySummary2.divId);
  const updateData = async () => {
    console.log('updating test energy summary');
    const newData = await fetch(
      'https://zen-fake-backend.herokuapp.com/energy/628eb63b796cba0007244c65'
    ).then((res) => res.json());

    myDiv.dataset.chartData = JSON.stringify(newData.energyData);
    myDiv2.dataset.chartData = JSON.stringify(newData.energyData);
  };

  await updateData();

  if (options.callChart) {
    callChartFromBlazor(
      'energySummaryChart',
      testMap.energySummary.chartId,
      testMap.energySummary.divId
    );
    callChartFromBlazor(
      'energySummaryChart',
      testMap.energySummary2.chartId,
      testMap.energySummary2.divId
    );
  }
  // setInterval(updateData, 60000);
};
