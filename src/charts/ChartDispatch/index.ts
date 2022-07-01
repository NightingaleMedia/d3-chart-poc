import { testDGPastEvents } from "../__tests__/demandGeniusPastEvents.test";
import { testEnergySiteBreakdown } from "../__tests__/energySiteBreakdownChart.test";
import { ChartDispatch } from "./ChartDispatch";
import { getChartImpl } from "./ChartMap";
import { ChartName } from "./types";

export const callChartFromBlazor = (
  chartName: ChartName,
  CHART_ID,
  DATA_DIV_ID,
) => {
  new ChartDispatch({
    chartName: chartName,
    id: CHART_ID,
    dataElementId: DATA_DIV_ID,
    chartBase: getChartImpl(chartName),
  });
};

window["CallChart"] = callChartFromBlazor;

testEnergySiteBreakdown({ callChart: true });
testDGPastEvents({ callChart: true });
