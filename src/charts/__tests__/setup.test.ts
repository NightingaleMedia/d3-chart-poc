export const setupTestDivs = (DIV_ID) => {
  const myDiv = document.createElement("div");
  document.lastChild?.appendChild(myDiv);
  myDiv.id = DIV_ID;
  return myDiv;
};

export const testMap = {
  energyBreakdown: {
    divId: `site-breakdown-chart--data`,
    chartId: `site-breakdown-chart`,
  },
  dgPastEvents: {
    divId: `dg-past-events--data`,
    chartId: `dg-past-events`,
  },
};
