import { timeFormat, area, line, select, min, max, scaleLinear, scaleTime, scaleBand, extent, axisBottom, axisRight, axisLeft, timeParse, pointer, curveNatural, symbol, symbolDiamond, leastIndex, curveStep, curveCatmullRom, } from 'd3';
import singleEvent from '../../../data/dg-single-event.json';
import getColor, { ColorAccessor } from './utils/getColor';
export function makeSingleDGChart(svgId, data) {
    var svg = select(`svg#${svgId}`), margin = { top: 30, right: 50, bottom: 30, left: 50 }, legendHeight = 50, legendWidth = 728, width = +svg.attr('width') - margin.left - margin.right, height = +svg.attr('height') - margin.top - margin.bottom - legendHeight;
    const SHOW_FAN = false;
    const defs = svg
        .append('defs')
        .append('clipPath')
        .attr('id', 'clip')
        .append('rect')
        .attr('width', width)
        .attr('height', height);
    const chartG = svg
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
    const fullChart = chartG
        .append('g')
        .attr('height', height)
        .attr('width', width);
    fullChart
        .append('rect')
        .attr('height', height + 0)
        .attr('width', width - 20)
        .attr('fill', 'var(--zss-chart-bg)')
        .attr('ry', 5)
        .attr('transform', `translate(10, -0)`);
    const dateParser = timeParse('%I:%M %p');
    const dateFormat = timeFormat('%-I:%M %p');
    const xAccessor = (d) => {
        if (d) {
            const titleString = dateParser(d.Time);
            return titleString;
        }
        else
            return null;
    };
    const render = (jsonData) => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const data = jsonData.map((d, i) => {
            var _a;
            return (Object.assign({ index: i, timeset: (_a = dateParser(d.Time)) !== null && _a !== void 0 ? _a : new Date() }, d));
        });
        if (!data || data.length < 1) {
            throw new console.error('Insufficient data');
        }
        let START_TIME_ENTRY = data.find((d) => d.EventWindow == true);
        if (!START_TIME_ENTRY) {
            START_TIME_ENTRY = data[0];
        }
        const END_TIME_ENTRY = data.find((d) => {
            var _a;
            return d.index > ((_a = START_TIME_ENTRY === null || START_TIME_ENTRY === void 0 ? void 0 : START_TIME_ENTRY.index) !== null && _a !== void 0 ? _a : 0) && d.EventWindow == false;
        });
        var dataXrange = extent(data, (d) => d.timeset);
        const HighOutdoor = Number(max(data.map((d) => d.OutdoorTemp)));
        const LowOutdoor = Number(min(data.map((d) => d.OutdoorTemp)));
        const HighSet = Number(max(data.map((d) => d.SetPoint)));
        const LowSet = Number(min(data.map((d) => d.SetPoint)));
        const RangeHigh = max([HighOutdoor, HighSet]);
        const RangeLow = min([LowOutdoor, LowSet]);
        var tempRange = [
            Math.floor(Number(RangeLow) / 10) * 10,
            Math.ceil(Number(RangeHigh) / 10) * 10,
        ];
        const kwhRange = [
            (_a = Math.floor(min(data.map((d) => d.EnergyUsage)) / 50) * 50) !== null && _a !== void 0 ? _a : 0,
            (_b = Math.ceil(max(data.map((d) => d.EnergyUsage)) / 100) * 100) !== null && _b !== void 0 ? _b : 1000,
        ];
        const xScale = scaleTime()
            .domain([(_c = dataXrange[0]) !== null && _c !== void 0 ? _c : new Date(), (_d = dataXrange[1]) !== null && _d !== void 0 ? _d : new Date()])
            .range([0, width])
            .nice();
        const tempYScale = scaleLinear().range([height, 0]).domain(tempRange);
        const kwhYScale = scaleLinear().range([height, 0]).domain(kwhRange);
        const NUM_Y_LINES = 10;
        const fanScaleY = scaleLinear()
            .domain([0, 3])
            .range([40, height / 3]);
        var xAxis = axisBottom(xScale)
            .scale(xScale)
            .tickSizeOuter(0)
            .tickFormat((d) => dateFormat(d));
        var yRightAxis = axisRight(tempYScale)
            .scale(tempYScale)
            .ticks(NUM_Y_LINES)
            .tickFormat((d) => d + '°')
            .tickSizeOuter(1);
        var yLeftAxis = axisLeft(kwhYScale)
            .scale(kwhYScale)
            .tickFormat((d) => d + ' kwh')
            .ticks(NUM_Y_LINES)
            .tickSize(-width + 40)
            .tickSizeOuter(0);
        chartG
            .append('g')
            .attr('class', 'y axis right')
            .call(yRightAxis)
            .call((g) => g
            .selectAll('.tick text')
            .attr('fill', getColor(ColorAccessor.AXIS_LABEL_COLOR)))
            .call((g) => {
            g.selectAll('.tick line').attr('stroke', getColor(ColorAccessor.AXIS_COLOR));
            g.selectAll('.tick:first-of-type line, .tick:first-of-type text')
                .attr('opacity', 0)
                .attr('stroke', 'white');
        })
            .attr('transform', `translate(${width},0)`);
        chartG
            .append('g')
            .attr('class', 'y axis left')
            .call(yLeftAxis)
            .call((g) => {
            g.selectAll('.tick line')
                .attr('transform', 'translate(20,0)')
                .attr('stroke', getColor(ColorAccessor.AXIS_COLOR));
            g.selectAll('.tick:nth-of-type(odd) line').attr('opacity', 0);
            g.selectAll('.tick text').attr('fill', getColor(ColorAccessor.AXIS_LABEL_COLOR));
            g.selectAll('.tick:first-of-type line, .tick:first-of-type text, .tick:last-of-type line, .tick:last-of-type text').attr('opacity', 0);
        });
        chartG
            .append('g')
            .attr('class', 'x axis')
            .attr('transform', `translate(0, ${height + 10})`)
            .call(xAxis)
            .call((g) => g
            .selectAll('.tick line, .tick text')
            .attr('text-rendering', 'optimizeLegibility')
            .attr('fill', getColor(ColorAccessor.AXIS_LABEL_COLOR)));
        const startEnd = fullChart
            .append('rect')
            .attr('class', 'single-event--event-window')
            .attr('fill', 'rgba(105,105,135,0.2)')
            .attr('height', height)
            .attr('width', () => {
            var _a, _b;
            const start = xScale((_a = START_TIME_ENTRY === null || START_TIME_ENTRY === void 0 ? void 0 : START_TIME_ENTRY.timeset) !== null && _a !== void 0 ? _a : new Date());
            const end = xScale((_b = END_TIME_ENTRY === null || END_TIME_ENTRY === void 0 ? void 0 : END_TIME_ENTRY.timeset) !== null && _b !== void 0 ? _b : new Date());
            return end - start;
        })
            .attr('x', xScale((_e = START_TIME_ENTRY === null || START_TIME_ENTRY === void 0 ? void 0 : START_TIME_ENTRY.timeset) !== null && _e !== void 0 ? _e : new Date()))
            .attr('y', 0);
        const energyLine = line()
            .curve(curveCatmullRom)
            .x((d) => xScale(d.timeset))
            .y((d) => kwhYScale(d.EnergyUsage));
        const setpointLine = line()
            .curve(curveStep)
            .x((d) => xScale(d.timeset))
            .y((d) => tempYScale(d.SetPoint));
        const ambientTempLine = line()
            .curve(curveNatural)
            .x((d) => xScale(d.timeset))
            .y((d) => tempYScale(d.AmbientTemp));
        const outdoorTempLine = line()
            .curve(curveNatural)
            .x((d) => xScale(d.timeset))
            .y((d) => tempYScale(d.OutdoorTemp));
        const fanLine = line()
            .curve(curveStep)
            .x((d) => xScale(d.timeset))
            .y((d) => {
            return -fanScaleY(d.Fan);
        });
        var areaFunc = area()
            .x((d) => d.timeset)
            .y((d) => d.EnergyUsage);
        chartG
            .append('path')
            .datum(data)
            .attr('d', areaFunc);
        if (SHOW_FAN) {
            chartG
                .append('path')
                .datum(data)
                .attr('class', 'single-event--fan-line')
                .attr('d', fanLine)
                .attr('stroke', getColor(ColorAccessor.FAN_COLOR))
                .attr('transform', `translate(0, ${height + 38})`);
        }
        chartG
            .append('path')
            .datum(data)
            .attr('class', 'single-event--fan-line')
            .attr('d', outdoorTempLine)
            .attr('stroke', getColor(ColorAccessor.OUTDOOR_TEMP_COLOR));
        chartG
            .append('path')
            .datum(data)
            .attr('class', 'single-event--energy-line')
            .attr('d', energyLine)
            .attr('stroke', getColor(ColorAccessor.ENERGY_LINE_COLOR))
            .attr('fill', 'none');
        chartG
            .append('path')
            .datum(data)
            .attr('class', 'single-event--setpoint-line')
            .attr('d', setpointLine)
            .attr('stroke', getColor(ColorAccessor.SETPOINT_LINE_COLOR))
            .attr('fill', 'none');
        chartG
            .append('path')
            .datum(data)
            .attr('class', 'single-event--ambient-temp-line')
            .attr('d', ambientTempLine)
            .attr('stroke', getColor(ColorAccessor.AMBIENT_TEMP_COLOR))
            .attr('stroke-width', 2)
            .attr('fill', 'none');
        const startEndLabels = fullChart
            .selectAll('g')
            .data([null, 'Start', 'End'])
            .enter()
            .append('g');
        startEndLabels
            .append('rect')
            .attr('fill', 'grey')
            .attr('class', 'start-end')
            .attr('height', 30)
            .attr('width', 55)
            .attr('ry', 3)
            .attr('x', (d, i) => {
            var _a, _b;
            if (i === 1) {
                return xScale((_a = START_TIME_ENTRY === null || START_TIME_ENTRY === void 0 ? void 0 : START_TIME_ENTRY.timeset) !== null && _a !== void 0 ? _a : new Date()) - 25;
            }
            else {
                return xScale((_b = END_TIME_ENTRY === null || END_TIME_ENTRY === void 0 ? void 0 : END_TIME_ENTRY.timeset) !== null && _b !== void 0 ? _b : new Date()) - 25;
            }
        })
            .attr('y', kwhYScale((_f = kwhRange[1]) !== null && _f !== void 0 ? _f : 0 - 20) - 15);
        startEndLabels
            .append('text')
            .attr('x', (d, i) => {
            var _a, _b;
            if (i === 1) {
                return xScale((_a = START_TIME_ENTRY === null || START_TIME_ENTRY === void 0 ? void 0 : START_TIME_ENTRY.timeset) !== null && _a !== void 0 ? _a : new Date()) - 25;
            }
            else {
                return xScale((_b = END_TIME_ENTRY === null || END_TIME_ENTRY === void 0 ? void 0 : END_TIME_ENTRY.timeset) !== null && _b !== void 0 ? _b : new Date()) - 25;
            }
        })
            .attr('y', kwhYScale((_g = kwhRange[1]) !== null && _g !== void 0 ? _g : 0 - 20) - 15)
            .style('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('dy', 20)
            .attr('dx', 55 / 2)
            .text(function (d) {
            return d;
        });
        var triangle = symbol().type(symbolDiamond).size(80);
        startEndLabels
            .append('path')
            .attr('d', triangle)
            .attr('fill', 'grey')
            .attr('class', 'triangle')
            .attr('transform', (d, i) => {
            var _a, _b, _c;
            const y = kwhYScale((_a = kwhRange[1]) !== null && _a !== void 0 ? _a : 0 - 20) + 15;
            let x;
            if (i === 1) {
                x = xScale((_b = START_TIME_ENTRY === null || START_TIME_ENTRY === void 0 ? void 0 : START_TIME_ENTRY.timeset) !== null && _b !== void 0 ? _b : new Date());
            }
            else {
                x = xScale((_c = END_TIME_ENTRY === null || END_TIME_ENTRY === void 0 ? void 0 : END_TIME_ENTRY.timeset) !== null && _c !== void 0 ? _c : new Date());
            }
            return `translate(${x}, ${y}) rotate(90)`;
        })
            .attr('x', (d, i) => {
            var _a, _b;
            if (i === 1) {
                return xScale((_a = START_TIME_ENTRY === null || START_TIME_ENTRY === void 0 ? void 0 : START_TIME_ENTRY.timeset) !== null && _a !== void 0 ? _a : new Date()) - 25;
            }
            else {
                return xScale((_b = END_TIME_ENTRY === null || END_TIME_ENTRY === void 0 ? void 0 : END_TIME_ENTRY.timeset) !== null && _b !== void 0 ? _b : new Date()) - 25;
            }
        })
            .attr('y', kwhYScale((_h = kwhRange[1]) !== null && _h !== void 0 ? _h : 0 - 20));
        const legend = svg.selectAll('legendBox').data([1]).enter().append('g');
        const legendBox = legend
            .append('g')
            .attr('x', 0)
            .attr('y', height + legendHeight + 10);
        const LegendKeys = ['Usage', 'Setpoint', 'Ambient Temp', 'Outdoor Temp'];
        if (SHOW_FAN) {
            LegendKeys.push('FAN');
        }
        const legendScale = scaleBand().domain(LegendKeys).range([0, legendWidth]);
        legendBox
            .append('rect')
            .attr('fill', 'rgba(50,50,50,0.6)')
            .attr('ry', 6)
            .attr('height', 34)
            .attr('width', legendWidth)
            .attr('y', Number(legendBox.attr('y')) + 15)
            .attr('x', legendWidth / 4 + 55);
        const legendSection = legend
            .selectAll('labels')
            .data(LegendKeys)
            .enter()
            .append('g')
            .attr('x', legendWidth / 4)
            .attr('width', legendScale.bandwidth());
        const colorLabels = legendSection
            .selectAll('labels')
            .data(LegendKeys)
            .enter()
            .append('rect')
            .attr('ry', 3)
            .attr('fill', (d) => {
            return {
                Usage: getColor(ColorAccessor.ENERGY_LINE_COLOR),
                Setpoint: getColor(ColorAccessor.SETPOINT_LINE_COLOR),
                Fan: getColor(ColorAccessor.FAN_COLOR),
                'Ambient Temp': getColor(ColorAccessor.AMBIENT_TEMP_COLOR),
                'Outdoor Temp': getColor(ColorAccessor.OUTDOOR_TEMP_COLOR),
            }[d];
        })
            .attr('height', 20)
            .attr('x', (d, i) => {
            var _a;
            const v = legendWidth / 4;
            return ((_a = legendScale(d)) !== null && _a !== void 0 ? _a : 0) + v + 63;
        })
            .attr('y', () => {
            const val = Number(legendBox.attr('y'));
            return val + 22;
        })
            .attr('width', 20);
        const legendText = legendSection
            .selectAll('text')
            .data(LegendKeys)
            .enter()
            .append('text')
            .text((d) => d)
            .attr('x', (d, i) => {
            var _a;
            const v = legendWidth / 4;
            return ((_a = legendScale(d)) !== null && _a !== void 0 ? _a : 0) + v + 93;
        })
            .attr('y', () => {
            const val = Number(legendBox.attr('y'));
            return val + 38;
        })
            .attr('fill', 'white');
        const updateLegendText = (datapoint) => {
            legendText.text((u) => {
                if (u == 'Setpoint') {
                    return `Setpoint:  ${datapoint['SetPoint']}° F`;
                }
                if (u == 'Usage') {
                    return `Usage:  ${datapoint['EnergyUsage']}KWH`;
                }
                if (u == 'Fan') {
                    return `Fan:  ${datapoint['Fan']}`;
                }
                if (u == 'Ambient Temp') {
                    return `Indoor:  ${datapoint['AmbientTemp']}° F`;
                }
                if (u == 'Outdoor Temp') {
                    return `Outdoor:  ${datapoint['OutdoorTemp']}° F`;
                }
            });
        };
        const tracer = chartG.append('g');
        const tracerLineY = tracer
            .append('rect')
            .attr('class', 'single-event--track-line-y')
            .attr('fill', 'white')
            .attr('height', height)
            .attr('width', 0.4)
            .attr('x', -100)
            .attr('y', 0);
        const tracerLineX = tracer
            .append('rect')
            .attr('class', 'single-event--track-line-x')
            .attr('height', 0.4)
            .attr('fill', 'white')
            .attr('width', width)
            .attr('y', -100);
        const tracerTextBg = tracer
            .append('rect')
            .attr('fill', 'var(--zss-blue)')
            .attr('width', 75)
            .attr('height', 35)
            .attr('ry', 6)
            .attr('text-anchor', 'middle')
            .attr('x', -width)
            .attr('y', -10);
        const tracerText = tracer
            .append('text')
            .attr('fill', 'white')
            .attr('text-anchor', 'middle')
            .attr('x', tracerLineY.attr('x'))
            .attr('y', 13);
        chartG
            .append('rect')
            .attr('width', width)
            .attr('height', height)
            .style('cursor', 'crosshair')
            .attr('fill', 'rgba(0,0,0,0)')
            .on('mousemove', function (event) {
            var _a, _b;
            const hoveredDate = xScale.invert(pointer(event)[0]);
            const getDistanceFromHoveredDate = (d) => Math.abs(xAccessor(d) - hoveredDate);
            const closestIndex = leastIndex(data, (a, b) => {
                return getDistanceFromHoveredDate(a) - getDistanceFromHoveredDate(b);
            });
            const closestDataPoint = data[closestIndex !== null && closestIndex !== void 0 ? closestIndex : 0];
            tracerLineX.attr('y', pointer(event)[1]);
            tracerLineY.attr('x', pointer(event)[0]);
            tracerText
                .attr('x', pointer(event)[0])
                .text((_a = closestDataPoint === null || closestDataPoint === void 0 ? void 0 : closestDataPoint.Time) !== null && _a !== void 0 ? _a : 'N/A');
            tracerTextBg
                .attr('x', pointer(event)[0] - 38)
                .text((_b = closestDataPoint === null || closestDataPoint === void 0 ? void 0 : closestDataPoint.Time) !== null && _b !== void 0 ? _b : '');
            updateLegendText(closestDataPoint);
            return;
        });
    };
    const theData = singleEvent;
    if (theData.length > 0) {
        render(theData);
    }
}
//# sourceMappingURL=index.js.map