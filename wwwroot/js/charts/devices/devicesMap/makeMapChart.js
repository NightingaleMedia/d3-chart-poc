import {geoEquirectangular} from "../../../_snowpack/pkg/d3.js";
import mapData from "../../../data/groups.json.proxy.js";
export const makeMapChart = () => {
  function render(data) {
    geoEquirectangular;
    console.log("map data:", data);
  }
  render(mapData.data.filter((d) => d.level === 4));
};
