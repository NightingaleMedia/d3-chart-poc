import { dgChart } from "./demandGenius/singleEvent/makeChart.js";
import { generateDGPastEventChart } from "./dgPastEvents/makeChart.js";
import { makeManyEvents } from "./demandGenius/manyEvents/makeManyEvents.js";
import { generateSummaryChart } from "./energyBreakdown/summaryChart.js";
import { makeBreakdownChart } from "./energyBreakdown/siteBreakdown.js";

// generateEnergyBreakdownChart();
// makeBar();

// const button = document.querySelector("#show-all");

// button.addEventListener("click", function (e) {
//   showAll(e);
// });

makeBreakdownChart();
dgChart();
generateDGPastEventChart();
makeManyEvents();
generateSummaryChart();
// generateDateRangeChart("date-range");
// tryAgain();
