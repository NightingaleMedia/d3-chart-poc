import c3 from "../../../_snowpack/pkg/c3.js";

function rand100() {
  let arr = Array.from(new Array(50));
  arr = arr.map((a) => {
    return Math.random() * 100;
  });
  return arr;
}

let inMemId;



export function updateChart() {
  const data = document.querySelector(`#${inMemId}`).dataset.daterangearray;
  console.log("update data: ");
  console.log(data.split(","));
}
export function generateChart(id) {
  console.log({ id });
  inMemId = id;
  const data = document.querySelector(`#${id}`).dataset.daterangearray;

  console.log(data.split(","));
  // c3.generate({
  //   bindto: `#${id}`,
  //   data: {
  //     columns: [["value", ...rand100()]],
  //     type: "bar",
  //     colors: {
  //       value: function (d) {
  //         if (d.value > 75) {
  //           return "var(--mud-palette-warning)";
  //         } else return "var(--mud-palette-primary)";
  //       },
  //     },
  //   },
  //   axis: {
  //     x: {
  //       show: false,
  //       type: "category",
  //     },
  //     y: {
  //       show: false,
  //     },
  //   },

  //   legend: {
  //     show: false,
  //   },
  // });
}
