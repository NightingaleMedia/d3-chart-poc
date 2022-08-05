import {makeManyEvents} from "../demandGenius/manyDGEventsComparison/manyDGEventsComparison.js";
import {makeSingleDGChart} from "../demandGenius/singleDGEventReport/index.js";
import {generateDeviceDataReport} from "../devices/deviceDataReport/deviceDataReport.js";
import {
  makeDGPastEventChart,
  updateDgPastEventsChart
} from "../dgPastEvents/dgPastEventsChart.js";
import {generateEnergySiteComparisonChart} from "../energySiteComparison/energySiteComparisonChart.js";
import {
  makeBreakdownChart,
  updateEnergySiteBreakdownChart
} from "../energySummary/energySiteBreakdownChart.js";
import {
  generateEnergySummaryChart,
  updateEnergySummaryChart
} from "../energySummary/energySummaryChart.js";
import {generateEnergyDonutChart} from "../sustainability/energyDonutChart.js";
import {
  makeEngagementChart,
  updateEngagementChart
} from "../sustainability/engagementScore/engagementScore.js";
import {generateGreenBrownAreaChart} from "../sustainability/greenBrownAreaChart.js";
import {makeGreenEngagement} from "../sustainability/greenEngagement/greenEngagementBar.js";
import {
  makePeakPerformance,
  updatePeakPerformance
} from "../sustainability/peakPerformance/peakPerformance.js";
import {makeSiteEnergyUsage} from "../sustainability/siteEnergyUsage/siteEnergyUsage.js";
import {ChartBase} from "./ChartBase.js";
const makeManyEvents__Class = new ChartBase({
  name: "Many DG Comparison Chart",
  chartRender: (id, data) => {
    makeManyEvents(id, data);
  },
  chartUpdate: (data) => {
  }
});
const singleDGChart__Class = new ChartBase({
  name: "Single Demand Genius Report",
  chartRender: (id, data) => makeSingleDGChart(id, data),
  chartUpdate: (data) => {
    console.log(this);
  }
});
const dgPastEventChart__Class = new ChartBase({
  name: "DG Past Event Chart",
  chartRender: (id, data) => {
    makeDGPastEventChart(id, data);
  },
  chartUpdate: (id, data) => {
    console.log({id, data});
    updateDgPastEventsChart(id, data);
  }
});
const energySiteBreakdownChart__Class = new ChartBase({
  name: "Energy Site Breakdown Chart",
  chartRender: (id, data) => {
    makeBreakdownChart(id, data);
  },
  chartUpdate: (id, data) => {
    updateEnergySiteBreakdownChart(id, data);
  }
});
const generateEnergySummaryChart__Class = new ChartBase({
  name: "Many Energy Summary Chart",
  chartRender: (id, data) => {
    console.log("making many smry: ", data);
    generateEnergySummaryChart(id, data, {isUpdate: false});
  },
  chartUpdate: (id, data) => {
    console.log("updating many smry: ", data);
    updateEnergySummaryChart(id, data);
  }
});
const generateEnergySiteComparisonChart__Class = new ChartBase({
  name: "Energy Site Comparison Chart",
  chartRender: (id, data) => {
    generateEnergySiteComparisonChart(id, data);
    console.log("site comparison: ", id, data);
  },
  chartUpdate: (data, id) => {
    console.log(id, data);
  }
});
const generateDeviceDataReport__Class = new ChartBase({
  name: "Device Data Report Chart",
  chartRender: (id, data) => {
    generateDeviceDataReport(id, data);
  },
  chartUpdate: (data, id) => {
    console.log(id, data);
  }
});
const generateEngagementChart__Class = new ChartBase({
  name: "Engagement Chart",
  chartRender: (id, data) => {
    makeEngagementChart(id, data);
  },
  chartUpdate: (id, data) => {
    updateEngagementChart(id, data);
  }
});
const generatePeakChart__Class = new ChartBase({
  name: "Peak Performance Chart",
  chartRender: (id, data) => {
    makePeakPerformance(id, data);
  },
  chartUpdate: (id, data) => {
    updatePeakPerformance(id, data);
  }
});
const generateGreenEngagement__Class = new ChartBase({
  name: "Green Engagement Chart",
  chartRender: (id, data) => {
    makeGreenEngagement(id, data);
  },
  chartUpdate: (id, data) => {
  }
});
const siteEnergyUsage__Class = new ChartBase({
  name: "Site Energy Usage",
  chartRender: (id, data) => {
    makeSiteEnergyUsage(id, data);
  },
  chartUpdate: (id, data) => {
  }
});
const greenBrownEnergy__Class = new ChartBase({
  name: "Green Brown Energy Comparison",
  chartRender: (id, data) => {
    generateGreenBrownAreaChart(id, data);
  },
  chartUpdate: (id, data) => {
  }
});
const generateDonutEnergyChart__Class = new ChartBase({
  name: "Energy Donut Chart",
  chartRender: (id, data) => {
    generateEnergyDonutChart(id, data);
  },
  chartUpdate: (id, data) => {
  }
});
const chartMap = {
  siteEnergyUsage: siteEnergyUsage__Class,
  greenEngagement: generateGreenEngagement__Class,
  peakPerformanceChart: generatePeakChart__Class,
  engagementChart: generateEngagementChart__Class,
  dgSingleReportChart: singleDGChart__Class,
  pastDGEventChart: dgPastEventChart__Class,
  dgManyReportChart: makeManyEvents__Class,
  energySummaryChart: generateEnergySummaryChart__Class,
  energySiteBreakdownChart: energySiteBreakdownChart__Class,
  greenBrownAreaChart: greenBrownEnergy__Class,
  energyDonutChart: generateDonutEnergyChart__Class,
  energySiteComparison: generateEnergySiteComparisonChart__Class,
  deviceDataReport: generateDeviceDataReport__Class
};
export const getChartImpl = (name) => {
  return chartMap[name];
};
