import { makeChart } from "./demandGenius/singleDGEventReport/index.js";
import { generateDGPastEventChart } from "./dgPastEvents/makeChart.js";
import { makeManyEvents } from "./demandGenius/manyDGEventsComparison/manyDGEventsComparison";
import { generateEnergySummaryChart } from "./energySummary/energySummaryChart.js";
import { makeBreakdownChart } from "./energySummary/energySiteBreakdownChart";
import { makeMapChart } from "./devices/devicesMap/makeMapChart.js";
import { generateSiteComparison } from "./energySiteComparison/energySiteComparisonChart.js";
import { generateBrownAreaChart } from "./sustainability/greenBrownAreaChart.js";
import { generateDonutEnergyChart } from "./sustainability/energyDonutChart.js";

makeBreakdownChart();
// single dg report
makeChart();
generateDGPastEventChart();
makeManyEvents();
generateEnergySummaryChart("#energy-summary");
makeMapChart();
generateSiteComparison();
generateBrownAreaChart();
generateDonutEnergyChart();
