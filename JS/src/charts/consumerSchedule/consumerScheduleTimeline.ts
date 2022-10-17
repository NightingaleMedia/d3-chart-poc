import {
  axisBottom,
  axisLeft,
  axisTop,
  extent,
  scaleBand,
  scaleUtc,
  select,
  selectAll,
  timeFormat,
  timeHour,
  timeMonth,
  timeParse,
  utcFormat,
  utcMonth,
} from 'd3';
// import { utcMonth } from "d3.js";
import consumerScheduleJson from '../../data/consumer-schedule.json';
var svg;
var chartG;

var xScale;
var yScale;
var xAxis;
var yAxis;

const daysObj = {
  monday: {
    name: 'monday',
    schedules: [],
  },
  tuesday: {
    name: 'tuesday',
    schedules: [],
  },
  wednesday: {
    name: 'wednesday',
    schedules: [],
  },
  thursday: {
    name: 'thursday',
    schedules: [],
  },
  friday: {
    name: 'friday',
    schedules: [],
  },
  saturday: {
    name: 'saturday',
    schedules: [],
  },
  sunday: {
    name: 'sunday',
    schedules: [],
  },
};

const get_gaps = (data: ConsumerScheduleItem['schedules']) => {
  console.log(data);
  let existing_hours: any[] = Array.from(new Array(24), (x, i) => null);

  data.forEach((d) => {
    let start_time = d.hourStart;
    // existing_hours[d.hourStart] = 'on';
    const ent_time = d.hourEnd;
    while (start_time < ent_time) {
      existing_hours[start_time] = d.index;
      start_time++;
    }
  });

  let temp_obj: any[] = [];
  let block: any[] = [];
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
  console.log({ temp_obj });
  temp_obj = temp_obj
    .filter((i) => i)
    .map((i, index) => {
      const hourStart = i[0];
      const hourEnd = i[i.length - 1] + 1;
      return {
        index: index,
        start: hourStart * 60 * 60,
        end: hourEnd * 60 * 60,
        hourStart,
        hourEnd,
        mode: 'off',
      };
    });

  return temp_obj;
};

const allDays = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

type ConsumerScheduleRequest = {
  data: ConsumerScheduleEntry[];
  day: string;
};
const transformData = (
  data: ConsumerScheduleEntry[],
  day: string
): ConsumerScheduleItem => {
  let finalObj = daysObj;
  //for every entry in the data, if a day is in that array, push that to the days schedule
  data.map((d) => {
    allDays.map((day: any) => {
      if (d.days.includes(day)) {
        finalObj[day]['schedules'] = [
          {
            start: d.start,
            end: d.end,
            hourStart: d.start / 60 / 60,
            hourEnd: d.end / 60 / 60,
            coolingSetpoint: d.coolingSetpoint,
            heatingSetpoint: d.heatingSetpoint,
            mode: d.mode,
            id: day + '--' + d.id,
          },
          ...finalObj[day].schedules,
        ];
      }
    });
  });

  return finalObj[day];
};

export const generateConsumerScheduleTimeline = (
  svgId: string,
  initData: ConsumerScheduleRequest
) => {
  const wrap = select('div.schedule--wrap');
  console.log(svgId);
  svg = wrap.append('svg').attr('id', `schedule--${svgId}`);

  var margin = { top: 0, right: 0, bottom: 0, left: 0 },
    width = 650,
    height = 50;
  // console.log("setup...");

  svg.attr('width', width).attr('height', height);
  chartG = svg
    .append('g')
    .attr('class', `chart-group--${svgId}`)
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .attr('width', width)
    .attr('height', height);
  const transformedData = transformData(initData.data, initData.day);

  let data = transformedData.schedules
    .sort((a, b) => a.start - b.start)
    .map((d, i: number) => ({
      ...d,
      index: i,
    }));

  const off_rectangles = get_gaps(data);
  // data = [...off_rectangles, ...data];
  xScale = scaleUtc().domain([1, 24]).range([0, width]).nice();

  console.log(xScale(18));

  const onSlots = chartG.selectAll('timing-section').data(data).enter();
  const offSlots = chartG.selectAll('off-square').data(off_rectangles).enter();
  const onSlotG = onSlots.append('g');
  const offSlogG = offSlots.append('g');

  onSlotG
    .append('rect')
    .attr('class', 'schedule-item scheduled')
    .attr('data-id', (d) => d.id)
    .attr('transform-origin', 'center')
    .attr('x', (d) => {
      return xScale(d.hourStart);
    })
    .attr('y', 0)
    .attr('height', height - 8)
    .attr('width', (d) => xScale(d.hourEnd) - xScale(d.hourStart))
    .attr('fill', (d) => {
      console.log(d);
      return d.mode == 'off' ? 'grey' : 'var(--zss-dg-roomRefresh)';
    })
    .attr('transform', `translate(0,4)`)
    .attr('stroke', 'white')
    .attr('stroke-width', 1.5);

  onSlotG
    .attr('class', 'schedule-item-text text-scheduled')
    .append('text')
    .style('pointer-events', 'none')
    .attr('text-anchor', 'middle')
    .text((d) => d.heatingSetpoint)
    .attr('y', height / 2 + 5)
    .attr('x', (d) => {
      const barWidth = xScale(d.hourEnd) - xScale(d.hourStart);
      return xScale(d.hourStart) + barWidth / 2;
    })
    .style('font-weight', 600)
    .attr('fill', 'white');

  offSlogG
    .append('rect')
    .attr('class', 'schedule-item off')
    .attr('transform-origin', 'center')
    .attr('x', (d) => {
      return xScale(d.hourStart);
    })
    .attr('y', 0)
    .attr('height', height - 8)
    .attr('width', (d) => xScale(d.hourEnd) - xScale(d.hourStart))
    .attr('fill', 'var(--zss-nominal)')
    .attr('transform', `translate(0,4)`)
    .attr('stroke', 'white')
    .attr('stroke-width', 1.5);

  selectAll('.schedule-item').on('click', function (e, d) {
    selectAll('.schedule-item').attr('stroke-width', 1.5);
    select(this).attr('stroke-width', 3);
  });

  offSlogG
    .attr('class', 'schedule-item-text off')
    .append('text')
    .attr('text-anchor', 'middle')
    .style('pointer-events', 'none')
    .text('Off')
    .attr('y', height / 2 + 5)
    .attr('x', (d) => {
      const barWidth = xScale(d.hourEnd) - xScale(d.hourStart);
      return xScale(d.hourStart) + barWidth / 2;
    })
    .attr('fill', 'white');

  // individual events
};

// const data = generateConsumerScheduleTimeline(
//   'div.schedule--wrap',
//   transformData(consumerScheduleJson.data, 'monday')
// );
