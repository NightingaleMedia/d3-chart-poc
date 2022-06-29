export class ChartBase {
  _render: (svgId: string, data: any) => void;
  _update: (data: any) => void;
  _name: string;
  constructor({ name, chartRender, chartUpdate }) {
    this._name = name;
    this._render = chartRender;
    this._update = chartUpdate;
  }

  render(svgId, data) {
    console.log("render: " + this._name);
    this._render(svgId, data);
  }
  update(data: any) {
    console.log("update: " + this._name);
    this._update(data);
  }
}
export default ChartBase;
