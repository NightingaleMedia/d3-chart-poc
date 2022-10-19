import { ChartBase } from './ChartBase';
import { chartObserver } from './chartObserver.js';
import { ChartName } from './types';

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
      `#${this._dataElementId}`
    ) as Element;
    // console.log("this data: ", this.getData());
    this.data = this.getData();

    this.callChart();
    chartObserver(this._dataElement, (v: MutationRecord) => {
      this.data = this.getData();
      this.updateChart(v);
    });
  }

  callChart() {
    // console.log("call chart: ", this.data);
    this._chartBase.render(this._chartId, this.data);
  }

  getData(): Record<string, any> {
    // console.log(`get data: `, this._chartBase._name);
    const value = document.querySelector(`#${this._dataElementId}`) as any;
    if (value.dataset.chartData) {
      return JSON.parse(value.dataset.chartData);
    } else return {};
  }

  updateChart(d: MutationRecord) {
    console.log('updating: ' + this._chartBase._name);
    // console.log('with data: ', this.data);
    this._chartBase.update(this.data, this._chartId);
  }
}
