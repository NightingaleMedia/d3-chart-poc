import { callChartFromBlazor } from '../ChartDispatch';
import { setupTestDivs, testMap } from './setup.test';
export const testGreenEngagement = (options: any) => {
  const myDiv = setupTestDivs(testMap.greenEngagement.divId);
  myDiv.dataset.chartData = JSON.stringify({ test: 'data' });

  if (options.callChart) {
    callChartFromBlazor(
      'greenEngagement',
      testMap.greenEngagement.chartId,
      testMap.greenEngagement.divId
    );
  }
};
