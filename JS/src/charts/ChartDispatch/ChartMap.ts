import { generateConsumerScheduleTimeline } from '../consumerSchedule/consumerScheduleTimeline';
import { makeManyEvents } from '../demandGenius/manyDGEventsComparison/manyDGEventsComparison';
import { makeSingleDGChart } from '../demandGenius/singleDGEventReport';
import { generateDeviceDataReport } from '../devices/deviceDataReport/deviceDataReport';
import { generateDeviceDataTable } from '../devices/deviceDataReport/deviceDataTable';
import {
  makeDGPastEventChart,
  updateDgPastEventsChart,
} from '../dgPastEvents/dgPastEventsChart';
import { generateEnergySiteComparisonChart } from '../energySiteComparison/energySiteComparisonChart';
import {
  makeBreakdownChart,
  updateEnergySiteBreakdownChart,
} from '../energySummary/energySiteBreakdownChart';
import {
  generateEnergySummaryChart,
  updateEnergySummaryChart,
} from '../energySummary/energySummaryChart';
import { generateEnergyDonutChart } from '../sustainability/energyDonutChart';
import {
  makeEngagementChart,
  updateEngagementChart,
} from '../sustainability/engagementScore/engagementScore';
import { generateGreenBrownAreaChart } from '../sustainability/greenBrownAreaChart';
import { makeGreenEngagement } from '../sustainability/greenEngagement/greenEngagementBar';
import {
  makePeakPerformance,
  updatePeakPerformance,
} from '../sustainability/peakPerformance/peakPerformance';
import { makeSiteEnergyUsage } from '../sustainability/siteEnergyUsage/siteEnergyUsage';
import { ChartBase } from './ChartBase';
import { ChartMap, ChartName } from './types';

const makeManyEvents__Class = new ChartBase({
  name: 'Many DG Comparison Chart',
  chartRender: (id, data) => {
    makeManyEvents(id, data);
  },
  chartUpdate: (data: any) => {},
});

const singleDGChart__Class = new ChartBase({
  name: 'Single Demand Genius Report',
  chartRender: (id, data) => makeSingleDGChart(id, data),
  chartUpdate: (data) => {
    console.log(this);
  },
});

const dgPastEventChart__Class = new ChartBase({
  name: 'DG Past Event Chart',
  chartRender: (id, data) => {
    makeDGPastEventChart(id, data);
  },
  chartUpdate: (id, data) => {
    console.log({ id, data });
    updateDgPastEventsChart(id, data);
  },
});

const energySiteBreakdownChart__Class = new ChartBase({
  name: 'Energy Site Breakdown Chart',
  chartRender: (id, data) => {
    makeBreakdownChart(id, data);
  },
  chartUpdate: (id: any, data) => {
    updateEnergySiteBreakdownChart(id, data);
  },
});

const generateEnergySummaryChart__Class = new ChartBase({
  name: 'Many Energy Summary Chart',
  chartRender: (id, data) => {
    console.log('making many smry: ', data);
    // generateEnergySummaryChart(id, data);
    generateEnergySummaryChart(id, data, { isUpdate: false });
  },
  chartUpdate: (id: string, data: any) => {
    console.log('updating many smry: ', data);
    updateEnergySummaryChart(id, data);
  },
});

const generateEnergySiteComparisonChart__Class = new ChartBase({
  name: 'Energy Site Comparison Chart',
  chartRender: (id, data) => {
    generateEnergySiteComparisonChart(id, data);
    console.log('site comparison: ', id, data);
  },
  chartUpdate: (data, id) => {
    console.log(id, data);
  },
});
const generateDeviceDataReport__Class = new ChartBase({
  name: 'Device Data Report Chart',
  chartRender: (id, data) => {
    generateDeviceDataReport(id, data);
    generateDeviceDataTable(id, data);
  },
  chartUpdate: (data, id) => {
    console.log(id, data);
  },
});
const generateEngagementChart__Class = new ChartBase({
  name: 'Engagement Chart',
  chartRender: (id, data) => {
    makeEngagementChart(id, data);
  },
  chartUpdate: (id, data) => {
    updateEngagementChart(id, data);
  },
});
const generatePeakChart__Class = new ChartBase({
  name: 'Peak Performance Chart',
  chartRender: (id, data) => {
    makePeakPerformance(id, data);
  },
  chartUpdate: (id, data) => {
    updatePeakPerformance(id, data);
  },
});
const generateGreenEngagement__Class = new ChartBase({
  name: 'Green Engagement Chart',
  chartRender: (id, data) => {
    makeGreenEngagement(id, data);
  },
  chartUpdate: (id, data) => {
    // updateGreenEngagement(id, data);
  },
});
const siteEnergyUsage__Class = new ChartBase({
  name: 'Site Energy Usage',
  chartRender: (id, data) => {
    makeSiteEnergyUsage(id, data);
  },
  chartUpdate: (id, data) => {
    // updateGreenEngagement(id, data);
  },
});
const greenBrownEnergy__Class = new ChartBase({
  name: 'Green Brown Energy Comparison',
  chartRender: (id, data) => {
    generateGreenBrownAreaChart(id, data);
  },
  chartUpdate: (id, data) => {
    // updateGreenEngagement(id, data);
  },
});
const generateDonutEnergyChart__Class = new ChartBase({
  name: 'Energy Donut Chart',
  chartRender: (id, data) => {
    generateEnergyDonutChart(id, data);
  },
  chartUpdate: (id, data) => {
    // updateGreenEngagement(id, data);
  },
});
const generateConsumerSchedule__Class = new ChartBase({
  name: 'Consumer Schedule Timeline',
  chartRender: (id, data) => {
    generateConsumerScheduleTimeline(id, data);
  },
  chartUpdate: (id, data) => {
    // updateGreenEngagement(id, data);
  },
});

const chartMap: ChartMap = {
  // single dg report
  consumerScheduleTimeline: generateConsumerSchedule__Class,
  energySiteBreakdownChart: energySiteBreakdownChart__Class,
  siteEnergyUsage: siteEnergyUsage__Class,
  greenEngagement: generateGreenEngagement__Class,
  peakPerformanceChart: generatePeakChart__Class,
  engagementChart: generateEngagementChart__Class,
  dgSingleReportChart: singleDGChart__Class,
  pastDGEventChart: dgPastEventChart__Class,
  dgManyReportChart: makeManyEvents__Class,
  energySummaryChart: generateEnergySummaryChart__Class,

  greenBrownAreaChart: greenBrownEnergy__Class,

  energyDonutChart: generateDonutEnergyChart__Class,
  energySiteComparison: generateEnergySiteComparisonChart__Class,
  deviceDataReport: generateDeviceDataReport__Class,
  // brownAreaChart: generateBrownAreaChart__Class,
};

export const getChartImpl = (name: ChartName): ChartBase => {
  return chartMap[name];
};
