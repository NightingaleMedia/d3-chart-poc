import { callChartFromBlazor } from '../ChartDispatch';
import { setupTestDivs, testMap } from './setup.test';

export const testPeakPerformance = async (options: any) => {
  const myDiv = setupTestDivs(testMap.peakChart.divId);

  const updateData = async () => {
    const newData = { percent: 50 };

    myDiv.dataset.chartData = JSON.stringify(newData);
  };

  await updateData();

  if (options.callChart) {
    callChartFromBlazor(
      'peakPerformanceChart',
      testMap.peakChart.chartId,
      testMap.peakChart.divId
    );
  }
  // setInterval(updateData, 60000);
};
