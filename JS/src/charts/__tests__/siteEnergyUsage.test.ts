import { callChartFromBlazor } from '../ChartDispatch';
import { setupTestDivs, testMap } from './setup.test';
import data from '../../data/energy-site-data.json';
export const testSiteEnergyUsage = (options: any) => {
  const myDiv = setupTestDivs(testMap.siteEnergyUsage.divId);
  myDiv.dataset.chartData = JSON.stringify(data);

  if (options.callChart) {
    callChartFromBlazor(
      'siteEnergyUsage',
      testMap.siteEnergyUsage.chartId,
      testMap.siteEnergyUsage.divId
    );
  }
};
