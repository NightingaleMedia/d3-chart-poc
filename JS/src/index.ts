import { callChartFromBlazor } from './charts/ChartDispatch';
import { callColorDate } from './calendar/Dispatch';
window['CallChart'] = callChartFromBlazor;
window['ColorDates'] = callColorDate;
