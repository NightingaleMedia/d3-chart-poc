import {callChartFromBlazor} from "./charts/ChartDispatch/index.js";
import {callColorDate} from "./calendar/Dispatch.js";
window["CallChart"] = callChartFromBlazor;
window["ColorDates"] = callColorDate;
