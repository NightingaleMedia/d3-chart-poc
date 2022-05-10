import { singleDGEventReport } from "./demandGenius/singleDGEventReport/singleDGEventReport.js";
import { generateDGPastEventChart } from "./dgPastEvents/makeChart.js";
import { makeManyEvents } from "./demandGenius/manyEvents/makeManyEvents.js";
import { generateEnergySummaryChart } from "./energySummary/energySummaryChart.js";
import { makeBreakdownChart } from "./energySummary/energySiteBreakdownChart";
import { makeMapChart } from "./devices/devicesMap/makeMapChart.js";
import { generateSiteComparison } from "./energySiteComparison/energySiteComparisonChart.js";

makeBreakdownChart();
singleDGEventReport();
generateDGPastEventChart();
makeManyEvents();
generateEnergySummaryChart();
makeMapChart();
generateSiteComparison();
