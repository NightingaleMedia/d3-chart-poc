export const transformData = ({ device, fields, values, }) => {
    const data = values.map((v, index) => {
        let singleValue = {};
        fields.forEach((f, index) => {
            if (f == 'relay') {
                singleValue[f] = {
                    W1: v[index].includes('W1'),
                    W2: v[index].includes('W2'),
                    G: v[index].includes('G'),
                    Y1: v[index].includes('Y1'),
                    Y: v[index].includes('Y'),
                };
            }
            else
                singleValue[f] = v[index];
        });
        return singleValue;
    });
    return { device, data };
};
//# sourceMappingURL=transformData.js.map