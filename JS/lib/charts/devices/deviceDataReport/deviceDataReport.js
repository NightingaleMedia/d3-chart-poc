import { timeFormat, area, line, select, min, max, scaleLinear, scaleTime, scaleBand, extent, axisBottom, axisRight, timeParse, pointer, leastIndex, curveStep, axisTop, utcFormat, timeHour, } from 'd3';
import getColor, { ColorAccessor } from './utils/getColor';
import { transformData } from './utils/transformData';
export function generateDeviceDataReport(svgId, dataObject) {
    var _a, _b, _c, _d;
    let data = dataObject.data;
    var svg = select(`svg#${svgId}`), margin = { top: 30, right: 50, bottom: 30, left: 50 }, legendHeight = 50, legendWidth = 728, width = +svg.attr('width') - margin.left - margin.right, height = +svg.attr('height') - margin.top - margin.bottom - legendHeight;
    const SHOW_FAN = false;
    svg
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
        .attr('height', height)
        .attr('width', width)
        .attr('fill', 'var(--zss-chart-bg)')
        .attr('ry', 5);
    const dateParser = timeParse('%_m/%e/%Y, %I:%M:%S %p');
    const dateFormat = timeFormat('%_I:%M %p');
    const toolTipDateFormat = timeFormat('%_I:%M %p');
    const xAccessor = (d) => {
        if (d) {
            const titleString = dateParser(new Date(d.timestamp).toLocaleString());
            return titleString;
        }
        else
            return null;
    };
    const constructedData = transformData(data[0]);
    const deviceData = constructedData.data
        .sort((a, b) => a.timestamp - b.timestamp)
        .map((d, i) => {
        var _a, _b;
        return (Object.assign({ index: i, timeset: (_b = dateParser(`${(_a = new Date(d.timestamp)) === null || _a === void 0 ? void 0 : _a.toLocaleString()}`)) !== null && _b !== void 0 ? _b : new Date() }, d));
    });
    var dataXrange = extent(deviceData, (d) => d.timeset);
    const HighLocal = Number(max(deviceData.map((d) => d.localTemperature)));
    const LowLocal = Number(min(deviceData.map((d) => d.localTemperature)));
    const HighCooling = Number(max(deviceData.map((d) => d.coolingSetpoint)));
    const LowCooling = Number(min(deviceData.map((d) => d.coolingSetpoint)));
    const HighHeat = Number(max(deviceData.map((d) => d.heatingSetpoint)));
    const LowHeat = Number(min(deviceData.map((d) => d.heatingSetpoint)));
    const RangeHigh = (_a = max([HighLocal, HighCooling, HighHeat])) !== null && _a !== void 0 ? _a : 0;
    const RangeLow = (_b = min([LowLocal, LowCooling, LowHeat])) !== null && _b !== void 0 ? _b : 0;
    var tempRange = [RangeLow - 5, RangeHigh + 6];
    const xScale = scaleTime()
        .domain([(_c = dataXrange[0]) !== null && _c !== void 0 ? _c : new Date(), (_d = dataXrange[1]) !== null && _d !== void 0 ? _d : new Date()])
        .range([0, width]);
    const tempYScale = scaleLinear().range([height, 0]).domain(tempRange);
    const NUM_Y_LINES = 10;
    const fanScaleY = scaleLinear()
        .domain([0, 10])
        .range([40, height / 3]);
    var xAxis = axisBottom(xScale)
        .scale(xScale)
        .ticks(10)
        .tickFormat((d) => dateFormat(d));
    var yRightAxis = axisRight(tempYScale)
        .scale(tempYScale)
        .ticks(NUM_Y_LINES)
        .tickFormat((d) => d + '°')
        .tickSizeOuter(1);
    chartG
        .append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0, ${height + 10})`)
        .call(xAxis)
        .call((g) => {
        g.selectAll('.tick line, .tick text')
            .attr('text-rendering', 'optimizeLegibility')
            .attr('fill', getColor(ColorAccessor.AXIS_LABEL_COLOR));
        g.selectAll('.domain').remove();
    });
    const coolingSetpointLine = line()
        .curve(curveStep)
        .x((d) => xScale(d.timeset))
        .y((d) => tempYScale(d.coolingSetpoint));
    const ambientTempLine = line()
        .curve(curveStep)
        .x((d) => xScale(d.timeset))
        .y((d) => tempYScale(d.localTemperature));
    const heatingTempLine = line()
        .curve(curveStep)
        .x((d) => xScale(d.timeset))
        .y((d) => tempYScale(d.heatingSetpoint));
    const fanLine = line()
        .curve(curveStep)
        .x((d) => xScale(d.timeset))
        .y((d) => {
        return -fanScaleY(d.fanMode);
    });
    var areaFunc = area()
        .x((d) => d.timestamp)
        .y((d) => d.coolingSetpoint);
    chartG
        .append('path')
        .datum(deviceData)
        .attr('d', areaFunc);
    if (SHOW_FAN) {
        chartG
            .append('path')
            .datum(deviceData)
            .attr('d', fanLine)
            .attr('stroke-width', '2px')
            .attr('stroke', getColor(ColorAccessor.FAN_COLOR))
            .attr('transform', `translate(0, ${height + 38})`);
    }
    chartG
        .append('path')
        .datum(deviceData)
        .attr('d', heatingTempLine)
        .attr('stroke-width', '2px')
        .attr('stroke', getColor(ColorAccessor.HEATING_TEMP_COLOR))
        .attr('fill', 'none');
    chartG
        .append('path')
        .datum(deviceData)
        .attr('d', coolingSetpointLine)
        .attr('stroke-width', '2px')
        .attr('stroke', getColor(ColorAccessor.COOLING_TEMP_COLOR))
        .attr('fill', 'none');
    chartG
        .append('path')
        .datum(deviceData)
        .attr('stroke-width', '3px')
        .attr('d', ambientTempLine)
        .attr('stroke', getColor(ColorAccessor.AMBIENT_TEMP_COLOR))
        .attr('fill', 'none');
    chartG
        .append('g')
        .attr('class', 'y axis right')
        .call(yRightAxis)
        .call((g) => g
        .selectAll('.tick text')
        .attr('transform', `translate(-30,0)`)
        .attr('fill', getColor(ColorAccessor.AXIS_LABEL_COLOR)))
        .call((g) => {
        g.selectAll('.tick line').attr('stroke', getColor(ColorAccessor.AXIS_COLOR));
        g.selectAll('.tick:first-of-type line, .tick:first-of-type text, .tick:last-of-type text')
            .attr('opacity', 0)
            .attr('stroke', 'white');
        g.selectAll('.domain').remove();
    });
    const x1MonthAxis = (g, x) => {
        g.attr('class', 'xMonthAxis').call(axisTop(x)
            .scale(x)
            .ticks(timeHour.every(24))
            .tickFormat(utcFormat('%a %-m/%d'))
            .tickSize(-height - margin.bottom - margin.top + 80));
        g.selectAll('.tick line')
            .attr('transform', `translate(${0}, ${12})`)
            .attr('stroke-width', 1)
            .attr('stroke-opacity', 1)
            .attr('stroke', 'var(--zss-chart-axis-line)');
        g.selectAll('.tick text')
            .attr('fill', 'white')
            .attr('opacity', '1')
            .attr('text-anchor', 'start')
            .attr('transform', 'translate(-28,-10)')
            .style('font-size', '1rem');
        g.selectAll('.domain').remove();
    };
    const mx = chartG.append('g').call(x1MonthAxis, xScale);
    const legend = svg.selectAll('legendBox').data([1]).enter().append('g');
    const legendBox = legend
        .append('g')
        .attr('x', 0)
        .attr('y', height + legendHeight + 10);
    const LegendKeys = ['Cooling Setpoint', 'Heating Setpoint', 'Ambient Temp'];
    if (SHOW_FAN) {
        LegendKeys.push('Fan');
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
            'Cooling Setpoint': getColor(ColorAccessor.COOLING_TEMP_COLOR),
            Fan: getColor(ColorAccessor.FAN_COLOR),
            'Ambient Temp': getColor(ColorAccessor.AMBIENT_TEMP_COLOR),
            'Heating Setpoint': getColor(ColorAccessor.HEATING_TEMP_COLOR),
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
            if (u == 'Cooling Setpoint') {
                return `Cooling Setpoint:  ${datapoint.coolingSetpoint}° F`;
            }
            if (u == 'Heating Setpoint') {
                return `Heating Setpoint:  ${datapoint.heatingSetpoint}° F`;
            }
            if (u == 'Fan') {
                return `Fan:  ${datapoint.fanMode}`;
            }
            if (u == 'Ambient Temp') {
                return `Indoor:  ${datapoint.localTemperature}° F`;
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
        .attr('width', 78)
        .attr('height', 35)
        .attr('ry', 6)
        .attr('text-anchor', 'middle')
        .attr('x', -width)
        .attr('y', 5);
    const tracerText = tracer
        .append('text')
        .attr('fill', 'white')
        .attr('text-anchor', 'middle')
        .attr('x', tracerLineY.attr('x'))
        .attr('y', 28);
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
        const closestIndex = leastIndex(deviceData, (a, b) => {
            return getDistanceFromHoveredDate(a) - getDistanceFromHoveredDate(b);
        });
        const closestDataPoint = deviceData[closestIndex !== null && closestIndex !== void 0 ? closestIndex : 0];
        tracerLineX.attr('y', pointer(event)[1]);
        tracerLineY.attr('x', pointer(event)[0]);
        tracerText
            .attr('x', pointer(event)[0])
            .text((_b = toolTipDateFormat((_a = closestDataPoint === null || closestDataPoint === void 0 ? void 0 : closestDataPoint.timeset) !== null && _a !== void 0 ? _a : new Date())) !== null && _b !== void 0 ? _b : 'N/A');
        tracerTextBg.attr('x', pointer(event)[0] - 38);
        updateLegendText(closestDataPoint);
        return;
    });
}
//# sourceMappingURL=deviceDataReport.js.map