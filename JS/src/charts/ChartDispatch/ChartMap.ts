import { makeManyEvents } from "../demandGenius/manyDGEventsComparison/manyDGEventsComparison";
import { makeSingleDGChart } from "../demandGenius/singleDGEventReport";
import { generateDeviceDataReport } from "../devices/deviceDataReport/deviceDataReport";
import {
  makeDGPastEventChart,
  updateDgPastEventsChart,
} from "../dgPastEvents/dgPastEventsChart";
import { generateEnergySiteComparisonChart } from "../energySiteComparison/energySiteComparisonChart";
import {
  makeBreakdownChart,
  updateEnergySiteBreakdownChart,
} from "../energySummary/energySiteBreakdownChart";
import {
  generateEnergySummaryChart,
  updateEnergySummaryChart,
} from "../energySummary/energySummaryChart";
import { ChartBase } from "./ChartBase";
import { ChartMap, ChartName } from "./types";

const makeManyEvents__Class = new ChartBase({
  name: "Many DG Comparison Chart",
  chartRender: (id, data) => {
    makeManyEvents(id, data);
  },
  chartUpdate: (data: any) => {},
});

const singleDGChart__Class = new ChartBase({
  name: "Single Demand Genius Report",
  chartRender: (id, data) => makeSingleDGChart(id, data),
  chartUpdate: (data) => {
    console.log(this);
  },
});

const dgPastEventChart__Class = new ChartBase({
  name: "DG Past Event Chart",
  chartRender: (id, data) => {
    makeDGPastEventChart(id, data);
  },
  chartUpdate: (id, data) => {
    console.log({ id, data });
    updateDgPastEventsChart(id, data);
  },
});

const energySiteBreakdownChart__Class = new ChartBase({
  name: "Energy Site Breakdown Chart",
  chartRender: (id, data) => {
    makeBreakdownChart(id, data);
  },
  chartUpdate: (id: any, data) => {
    updateEnergySiteBreakdownChart(id, data);
  },
});

const generateEnergySummaryChart__Class = new ChartBase({
  name: "Many Energy Summary Chart",
  chartRender: (id, data) => {
    // generateEnergySummaryChart(id, data);
    generateEnergySummaryChart(id, data);
  },
  chartUpdate: (id: string, data: any) => {
    console.log("making many smry: ", data);
    updateEnergySummaryChart(id, data);
  },
});

const generateEnergySiteComparisonChart__Class = new ChartBase({
  name: "Energy Site Comparison Chart",
  chartRender: (id, data) => {
    generateEnergySiteComparisonChart(id, data);
    console.log(id, data);
  },
  chartUpdate: (data, id) => {
    console.log(id, data);
  },
});
const generateDeviceDataReport__Class = new ChartBase({
  name: "Device Data Report Chart",
  chartRender: (id, data) => {
    generateDeviceDataReport(id, data);
  },
  chartUpdate: (data, id) => {
    console.log(id, data);
  },
});

const chartMap: ChartMap = {
  // single dg report
  dgSingleReportChart: singleDGChart__Class,
  pastDGEventChart: dgPastEventChart__Class,
  dgManyReportChart: makeManyEvents__Class,
  energySummaryChart: generateEnergySummaryChart__Class,
  energySiteBreakdownChart: energySiteBreakdownChart__Class,
  // brownAreaChart: generateBrownAreaChart__Class,
  // energyDonutChart: generateDonutEnergyChart__Class,
  energySiteComparison: generateEnergySiteComparisonChart__Class,
  deviceDataReport: generateDeviceDataReport__Class,
};

export const getChartImpl = (name: ChartName): ChartBase => {
  return chartMap[name];
};
