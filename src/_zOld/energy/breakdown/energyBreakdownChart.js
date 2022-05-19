import c3 from "c3";

export function generateEnergyBreakdownChart(id) {
  console.log("id: ", id);

  c3.generate({
    bindto: `[data-id="${id}"]`,
    bar: {
      width: { ratio: 0.2 },
    },
    data: {
      x: "x",
      columns: [
        ["x", "site1", "site2", "site3"],
        ["site1", 5, 5, 5],
        ["site2", 10, 10, 10],
        ["site3", 15, 15, 15],
      ],
      type: "bar",
      groups: [["site1", "site2", "site3"]],
    },
    axis: {
      rotated: true,
      x: { type: "category", categories: ["site1", "site2", "site3"] },
      y: {
        show: false,
      },
    },
    grid: {
      x: {
        lines: [{ value: 0 }],
      },
    },
  });
}
