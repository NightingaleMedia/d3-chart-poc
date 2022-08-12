import dgPastEvents from '../../data/dg-events.json';
import { callChartFromBlazor } from '../ChartDispatch';
import { setupTestDivs, testMap } from './setup.test';

const dataToAppend = dgPastEvents;
export const testDGPastEvents = (options: any) => {
  const myDiv = setupTestDivs(testMap.dgPastEvents.divId);
  myDiv.dataset.chartData = JSON.stringify(dataToAppend);

  const updateData = async () => {
    const newData = await fetch(
      'https://zen-fake-backend.herokuapp.com/demand-genius'
    ).then((res) => res.json());

    myDiv.dataset.chartData = JSON.stringify(newData);
  };

  updateData();
  // setInterval(updateData, 10000);

  if (options.callChart) {
    callChartFromBlazor(
      'pastDGEventChart',
      testMap.dgPastEvents.chartId,
      testMap.dgPastEvents.divId
    );
  }
};
