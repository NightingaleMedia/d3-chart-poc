const style = (node, styles) => Object.keys(styles).forEach((key) => node.style[key] = styles[key]);
const element = document.querySelector("h1");
style(element, {
  background: "black",
  color: "yellow"
});
