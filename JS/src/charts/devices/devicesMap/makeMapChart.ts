import * as d3 from "d3";
import { geoEquirectangular } from "d3";
import mapData from "../../../data/groups.json";

export const makeMapChart = () => {
  function render(data) {
    geoEquirectangular;
    console.log("map data:", data);
  }

  render(mapData.data.filter((d) => d.level === 4));
};
