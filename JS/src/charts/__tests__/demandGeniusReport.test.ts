import { callChartFromBlazor } from '../ChartDispatch';
import { setupTestDivs, testMap } from './setup.test';

export const makeDgEventReport = (options: any) => {
  const myDiv = setupTestDivs(testMap.dgEventReport.divId);
  myDiv.dataset.chartData = JSON.stringify({ test: 'data' });

  //   const updateData = async () => {
  //     const newData = await fetch(
  //       'https://zen-fake-backend.herokuapp.com/demand-genius'
  //     ).then((res) => res.json());

  //     myDiv.dataset.chartData = JSON.stringify(newData);
  //   };

  //   // updateData();
  //   setInterval(updateData, 10000);

  if (options.callChart) {
    callChartFromBlazor(
      'dgSingleReportChart',
      testMap.dgEventReport.chartId,
      testMap.dgEventReport.divId
    );
  }
};
