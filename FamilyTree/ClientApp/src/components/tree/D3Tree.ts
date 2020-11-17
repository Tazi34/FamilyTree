import { initializeNodes, initializeLinks } from "./D3Initializers";

const d3 = require("d3");

var margin = { top: 120, right: 100, bottom: 120, left: 100 },
  width = 1100 - margin.right - margin.left,
  height = 1000 - margin.top - margin.bottom;

var mainNode = document.createElement("div");

var svg = d3
  .select(mainNode)
  .append("svg")
  .attr("width", width + margin.right + margin.left)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var root = d3.hierarchy();
var treeLayout = d3.tree().size([width, height]);
var links = svg.append("g").attr("class", "links");
var nodes = svg.append("g").attr("class", "nodes");
var layout = treeLayout(root);
var linksData = layout.links();

initializeNodes(nodes, root.descendants());
initializeLinks(links, linksData);

export { mainNode };
