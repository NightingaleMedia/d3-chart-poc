import { CountUp } from "../../_snowpack/pkg/countupjs.js";
export function useCountup(dataId, value, params) {
  const options = JSON.parse(params);
  options.decimal = options.decimalValue;
  const countUp = new CountUp(dataId, value, options);
  countUp.start();
}
