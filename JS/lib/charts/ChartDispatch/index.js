import { ChartDispatch } from "./ChartDispatch";
import { getChartImpl } from "./ChartMap";
export const callChartFromBlazor = (chartName, CHART_ID, DATA_DIV_ID) => {
    new ChartDispatch({
        chartName: chartName,
        id: CHART_ID,
        dataElementId: DATA_DIV_ID,
        chartBase: getChartImpl(chartName),
    });
};
//# sourceMappingURL=index.js.map