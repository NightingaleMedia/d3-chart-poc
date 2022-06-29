import { ChartBase } from "./ChartBase";
import { chartObserver } from "./chartObserver.js";
import { ChartName } from "./types";

type DispatchProps = {
  chartName: ChartName;
  id: string;
  dataElementId: string;
  chartBase: ChartBase;
};
export class ChartDispatch {
  _chartId: string;
  _dataElement: Element;
  _dataElementId: string;
  _chartBase: ChartBase;
  data: any;
  constructor({ id, dataElementId, chartBase }: DispatchProps) {
    this._chartId = id;
    this._dataElementId = dataElementId;
    this._chartBase = chartBase;

    this._dataElement = document.querySelector(
      `#${this._dataElementId}`,
    ) as Element;

    this.data = this.getData();
    // console.log("this data: ", this.data);
    this.callChart();
    chartObserver(this._dataElement, (v: MutationRecord) => {
      this.data = this.getData();
      this.updateChart(v);
    });
  }

  callChart() {
    console.log("call chart: ", this.data);
    this._chartBase.render(this._chartId, this.data);
  }

  getData(): Record<string, any> {
    const value = document.querySelector(`#${this._dataElementId}`) as any;
    return JSON.parse(value.dataset.fakeData);
  }

  updateChart(d: MutationRecord) {
    console.log("updating: " + this._chartBase._name);
    console.log("with data: ", this.data);
    this._chartBase.update(this.data, this._chartId);
  }
}