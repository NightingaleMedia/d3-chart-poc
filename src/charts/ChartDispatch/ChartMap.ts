import { makeManyEvents } from "../demandGenius/manyDGEventsComparison/manyDGEventsComparison";
import { makeSingleDGChart } from "../demandGenius/singleDGEventReport";
import { generateDGPastEventChart } from "../dgPastEvents/makeChart";
import { generateEnergySiteComparisonChart } from "../energySiteComparison/energySiteComparisonChart";
import {
  makeBreakdownChart,
  updateEnergySiteBreakdownChart,
} from "../energySummary/energySiteBreakdownChart";
import { generateEnergySummaryChart } from "../energySummary/energySummaryChart";
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
  name: "Energy Site Breakdown Chart",
  chartRender: (id, data) => {
    generateDGPastEventChart(id, data);
  },
  chartUpdate: (data: any) => {},
});

const energySiteBreakdownChart__Class = new ChartBase({
  name: "Energy Site Breakdown Chart",
  chartRender: (id, data) => {
    makeBreakdownChart(id, data);
  },
  chartUpdate: (data: any, id) => {
    updateEnergySiteBreakdownChart(id, data);
  },
});

const generateEnergySummaryChart__Class = new ChartBase({
  name: "Many DG Comparison Chart",
  chartRender: (id, data) => {
    generateEnergySummaryChart(id, data);
  },
  chartUpdate: (data: any) => {},
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
};

export const getChartImpl = (name: ChartName): ChartBase => {
  return chartMap[name];
};
