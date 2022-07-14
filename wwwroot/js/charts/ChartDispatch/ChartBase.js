export class ChartBase {
  constructor({name, chartRender, chartUpdate}) {
    this._name = name;
    this._render = chartRender;
    this._update = chartUpdate;
  }
  render(svgId, data) {
    this._render(svgId, data);
  }
  update(data, svgId = "") {
    this._update(svgId, data);
  }
}
export default ChartBase;
