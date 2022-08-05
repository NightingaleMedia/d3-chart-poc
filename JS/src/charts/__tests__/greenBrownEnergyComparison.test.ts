import { callChartFromBlazor } from '../ChartDispatch';
import { getBrownData, getGreenData } from '../sustainability/utils/getData';
import { setupTestDivs, testMap } from './setup.test';
export const testGreenBrownEnergyComparison = (options: any) => {
  const brData = getBrownData();
  const grData = getGreenData();
  const myDiv = setupTestDivs(testMap.greenBrownComparison.divId);
  myDiv.dataset.chartData = JSON.stringify({
    brownEnergy: brData,
    greenEnergy: grData,
  });

  if (options.callChart) {
    callChartFromBlazor(
      'greenBrownAreaChart',
      testMap.greenBrownComparison.chartId,
      testMap.greenBrownComparison.divId
    );
  }
};
