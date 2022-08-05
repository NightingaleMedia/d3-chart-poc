import greenData from '../../../data/greenEnergyUsage.json';
export const getBrownData = () => {
    let result = greenData.data.filter((d) => d.type === 'brown');
    result = result.map((r) => (Object.assign({ x: r.time, y: r.usage }, r)));
    return result;
};
export const getGreenData = () => {
    let result = greenData.data.filter((d) => d.type === 'green');
    result = result.map((r, index) => (Object.assign({ x: r.time, y: r.usage }, r)));
    return result;
};
//# sourceMappingURL=getData.js.map