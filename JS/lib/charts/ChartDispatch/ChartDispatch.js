import { chartObserver } from "./chartObserver.js";
export class ChartDispatch {
    constructor({ id, dataElementId, chartBase }) {
        this._chartId = id;
        this._dataElementId = dataElementId;
        this._chartBase = chartBase;
        this._dataElement = document.querySelector(`#${this._dataElementId}`);
        this.data = this.getData();
        this.callChart();
        chartObserver(this._dataElement, (v) => {
            this.data = this.getData();
            this.updateChart(v);
        });
    }
    callChart() {
        console.log("call chart: ", this.data);
        this._chartBase.render(this._chartId, this.data);
    }
    getData() {
        const value = document.querySelector(`#${this._dataElementId}`);
        if (value.dataset.chartData) {
            return JSON.parse(value.dataset.chartData);
        }
        else
            return {};
    }
    updateChart(d) {
        console.log("updating: " + this._chartBase._name);
        console.log("with data: ", this.data);
        this._chartBase.update(this.data, this._chartId);
    }
}
//# sourceMappingURL=ChartDispatch.js.map