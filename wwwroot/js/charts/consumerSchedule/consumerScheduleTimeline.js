import {
  scaleUtc,
  select,
  selectAll
} from "../../_snowpack/pkg/d3.js";
import consumerScheduleJson from "../../data/consumer-schedule.json.proxy.js";
var svg;
var chartG;
var xScale;
var yScale;
var xAxis;
var yAxis;
const daysObj = {
  monday: {
    name: "monday",
    schedules: []
  },
  tuesday: {
    name: "tuesday",
    schedules: []
  },
  wednesday: {
    name: "wednesday",
    schedules: []
  },
  thursday: {
    name: "thursday",
    schedules: []
  },
  friday: {
    name: "friday",
    schedules: []
  },
  saturday: {
    name: "saturday",
    schedules: []
  },
  sunday: {
    name: "sunday",
    schedules: []
  }
};
const get_gaps = (data2) => {
  console.log(data2);
  let existing_hours = Array.from(new Array(24), (x, i) => null);
  data2.forEach((d) => {
    let start_time = d.hourStart;
    const ent_time = d.hourEnd;
    while (start_time < ent_time) {
      existing_hours[start_time] = d.index;
      start_time++;
    }
  });
  let temp_obj = [];
  let block = [];
  existing_hours.map((x, i) => {
    if (x == null || i == 23) {
      block.push(i);
      if (existing_hours[i] == null) {
        temp_obj.push(block);
      }
    } else {
      if (block.length !== 0) {
        temp_obj.push(block);
      }
      block = [];
      temp_obj.push(null);
    }
  });
  console.log({temp_obj});
  temp_obj = temp_obj.filter((i) => i).map((i, index) => {
    const hourStart = i[0];
    const hourEnd = i[i.length - 1] + 1;
    return {
      index,
      start: hourStart * 60 * 60,
      end: hourEnd * 60 * 60,
      hourStart,
      hourEnd,
      mode: "off"
    };
  });
  return temp_obj;
};
const allDays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday"
];
const transformData = (data2, day) => {
  let finalObj = daysObj;
  data2.map((d) => {
    allDays.map((day2) => {
      if (d.days.includes(day2)) {
        finalObj[day2]["schedules"] = [
          {
            start: d.start,
            end: d.end,
            hourStart: d.start / 60 / 60,
            hourEnd: d.end / 60 / 60,
            coolingSetpoint: d.coolingSetpoint,
            heatingSetpoint: d.heatingSetpoint,
            mode: d.mode,
            id: day2 + "--" + d.id
          },
          ...finalObj[day2].schedules
        ];
      }
    });
  });
  return finalObj[day];
};
export const makeConsumerScheduleTimeline = (svgId, initData) => {
  const wrap = select(svgId);
  svg = wrap.append("svg").attr("id", `svg#${svgId}`);
  var margin = {top: 0, right: 0, bottom: 0, left: 0}, width = 650, height = 50;
  svg.attr("width", width).attr("height", height);
  chartG = svg.append("g").attr("class", `chart-group--${svgId}`).attr("transform", `translate(${margin.left}, ${margin.top})`).attr("width", width).attr("height", height);
  let data2 = initData.schedules.sort((a, b) => a.start - b.start).map((d, i) => ({
    ...d
  }));
  const off_rectangles = get_gaps(data2);
  xScale = scaleUtc().domain([1, 24]).range([0, width]).nice();
  console.log(xScale(18));
  const onSlots = chartG.selectAll("timing-section").data(data2).enter();
  const offSlots = chartG.selectAll("off-square").data(off_rectangles).enter();
  const onSlotG = onSlots.append("g");
  const offSlogG = offSlots.append("g");
  onSlotG.append("rect").attr("class", "schedule-item scheduled").attr("data-id", (d) => d.id).attr("transform-origin", "center").attr("x", (d) => {
    return xScale(d.hourStart);
  }).attr("y", 0).attr("height", height - 8).attr("width", (d) => xScale(d.hourEnd) - xScale(d.hourStart)).attr("fill", (d) => {
    console.log(d);
    return d.mode == "off" ? "grey" : "var(--zss-dg-roomRefresh)";
  }).attr("transform", `translate(0,4)`).attr("stroke", "white").attr("stroke-width", 1);
  onSlotG.attr("class", "schedule-item-text text-scheduled").append("text").style("pointer-events", "none").attr("text-anchor", "middle").text((d) => {
    if (d.coolingSetpoint)
      return d.coolingSetpoint;
    else
      return d.heatingSetpoint;
  }).attr("y", height / 2 + 5).attr("x", (d) => {
    const barWidth = xScale(d.hourEnd) - xScale(d.hourStart);
    return xScale(d.hourStart) + barWidth / 2;
  }).attr("fill", "white");
  offSlogG.append("rect").attr("class", "schedule-item off").attr("transform-origin", "center").attr("x", (d) => {
    return xScale(d.hourStart);
  }).attr("y", 0).attr("height", height - 8).attr("width", (d) => xScale(d.hourEnd) - xScale(d.hourStart)).attr("fill", "var(--zss-nominal)").attr("transform", `translate(0,4)`).attr("stroke", "white").attr("stroke-width", 1);
  selectAll(".schedule-item").on("click", function(e, d) {
    selectAll(".schedule-item").attr("stroke-width", 1);
    select(this).attr("stroke-width", 3);
  });
  offSlogG.attr("class", "schedule-item-text off").append("text").attr("text-anchor", "middle").style("pointer-events", "none").text("Off").attr("y", height / 2 + 5).attr("x", (d) => {
    const barWidth = xScale(d.hourEnd) - xScale(d.hourStart);
    return xScale(d.hourStart) + barWidth / 2;
  }).attr("fill", "white");
};
const data = makeConsumerScheduleTimeline("div.schedule--wrap", transformData(consumerScheduleJson.data, "monday"));
