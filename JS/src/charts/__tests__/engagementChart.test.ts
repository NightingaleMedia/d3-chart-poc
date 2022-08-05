import { callChartFromBlazor } from '../ChartDispatch';
import { setupTestDivs, testMap } from './setup.test';

export const testEngagementChart = async (options: any) => {
  const myDiv = setupTestDivs(testMap.engagementChart.divId);

  const updateData = async () => {
    console.log('updating test energy summary');
    const newData = { percent: Math.random() * 100 };

    myDiv.dataset.chartData = JSON.stringify(newData);
  };

  await updateData();

  if (options.callChart) {
    callChartFromBlazor(
      'engagementChart',
      testMap.engagementChart.chartId,
      testMap.engagementChart.divId
    );
  }
  setInterval(updateData, 3000);
};
