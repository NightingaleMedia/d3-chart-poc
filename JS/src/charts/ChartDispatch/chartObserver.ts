export const chartObserver = (element, callback) => {
  const obs = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === "attributes") {
        callback(mutation);
      }
    });
  });
  obs.observe(element, { attributes: true });
};
