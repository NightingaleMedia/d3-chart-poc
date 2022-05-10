import * as d3 from "d3";
import mapData from "../../../../data/groups.json";

export const makeMapChart = () => {
  function render(data) {
    d3.geoEquirectangular;
    console.log("map data:", data);
  }

  render(mapData.data.filter((d) => d.level === 4));
};
