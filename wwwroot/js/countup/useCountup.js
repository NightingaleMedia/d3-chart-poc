import { CountUp } from "../_snowpack/pkg/countupjs.js";
export function useCountup(dataId, value, params) {
  const options = JSON.parse(params);

  //   decimal is a protected keyword in c# so we pass decimalValue
  options.decimal = options.decimalValue;
  const countUp = new CountUp(dataId, value, options);
  countUp.start();
}
