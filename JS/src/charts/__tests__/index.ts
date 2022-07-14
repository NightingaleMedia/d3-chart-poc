import { testDGPastEvents } from "./demandGeniusPastEvents.test";
import { testDeviceData } from "./deviceDataReport";
import { testEnergySiteBreakdown } from "./energySiteBreakdownChart.test";
import { testEnergySummary } from "./energySummaryChart";

testEnergySiteBreakdown({ callChart: true });
testDGPastEvents({ callChart: true });
testEnergySummary({ callChart: true });
testDeviceData({ callChart: true });
