import {ChartDispatch} from "./ChartDispatch.js";
import {getChartImpl} from "./ChartMap.js";
export const callChartFromBlazor = (chartName, CHART_ID, DATA_DIV_ID) => {
  new ChartDispatch({
    chartName,
    id: CHART_ID,
    dataElementId: DATA_DIV_ID,
    chartBase: getChartImpl(chartName)
  });
};
