import dgPastEvents from '../../data/dg-events.json';
import { callChartFromBlazor } from '../ChartDispatch';
import { setupTestDivs, testMap } from './setup.test';
import consumerScheduleJson from '../../data/consumer-schedule.json';
export const testConsumerSchedule = (options: any) => {
  const myDiv = setupTestDivs(testMap.consumerSchedule.divId);
  myDiv.dataset.chartData = JSON.stringify({
    data: consumerScheduleJson.data,
    day: 'monday',
  });

  // const updateData = async () => {
  //   const newData = await fetch(
  //     'https://zen-fake-backend.herokuapp.com/demand-genius'
  //   ).then((res) => res.json());
  //   console.log({ newData });
  //   myDiv.dataset.chartData = JSON.stringify(newData);
  // };

  // updateData();
  // setInterval(updateData, 10000);

  if (options.callChart) {
    callChartFromBlazor(
      'consumerScheduleTimeline',
      testMap.consumerSchedule.chartId,
      testMap.consumerSchedule.divId
    );
  }
};
