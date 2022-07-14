type ChartBaseProps = {
  name: string;
  chartRender: (svgId: string, data: any) => void;
  chartUpdate: (data: any, svgId?: string) => void;
};

export class ChartBase {
  _render: ChartBaseProps["chartRender"];
  _update: ChartBaseProps["chartUpdate"];
  _name: ChartBaseProps["name"];

  constructor({ name, chartRender, chartUpdate }: ChartBaseProps) {
    this._name = name;
    this._render = chartRender;
    this._update = chartUpdate;
  }

  render(svgId, data) {
    // console.log("render: " + this._name);
    this._render(svgId, data);
  }
  update(data: any, svgId: string = "") {
    // console.log("update: " + this._name);
    this._update(svgId, data);
  }
}
export default ChartBase;
