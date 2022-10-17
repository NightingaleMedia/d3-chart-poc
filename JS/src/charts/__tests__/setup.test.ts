export const setupTestDivs = (DIV_ID) => {
  const myDiv = document.createElement('div');
  document.lastChild?.appendChild(myDiv);
  myDiv.id = DIV_ID;
  return myDiv;
};

export const testMap = {
  consumerSchedule: {
    divId: `consumer-schedule--data`,
    chartId: `test-chart`,
  },
  energyBreakdown: {
    divId: `site-breakdown-chart--data`,
    chartId: `site-breakdown-chart`,
  },
  dgPastEvents: {
    divId: `dg-past-events--data`,
    chartId: `dg-past-events`,
  },
  energySummary: {
    divId: `energy-summary-chart--data`,
    chartId: `energy-summary-chart`,
  },
  energySummary2: {
    divId: `energy-summary-chart--data-2`,
    chartId: `energy-summary-chart-2`,
  },
  energySiteComparison: {
    divId: `energy-site-comparison-chart--data`,
    chartId: `energy-site-comparison-chart`,
  },
  deviceDataReport: {
    divId: `device-data--data`,
    chartId: `device-data--chart`,
  },
  engagementChart: {
    divId: `engagement--data`,
    chartId: `engagement--chart`,
  },
  peakChart: {
    divId: `peak-performance--data`,
    chartId: `peak-performance--chart`,
  },
  greenEngagement: {
    divId: `green-engagement--data`,
    chartId: `green-engagement--chart`,
  },
  siteEnergyUsage: {
    divId: `site-energy-usage--data`,
    chartId: `site-energy-usage--chart`,
  },
  greenBrownComparison: {
    divId: `green-brown-comparison--data`,
    chartId: `green-brown-comparison--chart`,
  },
  energyDonutChart: {
    divId: `energy-donut--data`,
    chartId: `energy-donut--chart`,
  },
  dgEventReport: {
    divId: `dg-event-report--data`,
    chartId: `dg-event-report--chart`,
  },
};
