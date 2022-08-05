var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import dgPastEvents from "../../data/dg-events.json";
import { callChartFromBlazor } from "../ChartDispatch";
import { setupTestDivs, testMap } from "./setup.test";
const dataToAppend = dgPastEvents;
export const testDGPastEvents = (options) => {
    const myDiv = setupTestDivs(testMap.dgPastEvents.divId);
    myDiv.dataset.chartData = JSON.stringify(dataToAppend);
    const updateData = () => __awaiter(void 0, void 0, void 0, function* () {
        const newData = yield fetch("https://zen-fake-backend.herokuapp.com/demand-genius").then((res) => res.json());
        myDiv.dataset.chartData = JSON.stringify(newData);
    });
    setInterval(updateData, 10000);
    if (options.callChart) {
        callChartFromBlazor("pastDGEventChart", testMap.dgPastEvents.chartId, testMap.dgPastEvents.divId);
    }
};
//# sourceMappingURL=demandGeniusPastEvents.test.js.map