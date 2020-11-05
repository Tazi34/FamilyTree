import data from "../../samples/3levelsSample.json";
import { displayMap } from "./NodeDataMappers";
const d3 = require("d3");

var margin = { top: 120, right: 20, bottom: 120, left: 20 },
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
var treeLayout = d3.tree().size([width, height]);
var links = svg.append("g").attr("class", "links");
var nodes = svg.append("g").attr("class", "nodes");

var root = d3.hierarchy(data);

treeLayout(root);
console.log(root);
//nodes
const rectWidth = 200;
const rectHeight = 120;

nodes
  .selectAll("circle.node")
  .data(root.descendants())
  .enter()
  .append("rect")
  .classed("node", true)
  .attr("x", function (d) {
    return d.x;
  })
  .attr("y", function (d) {
    return d.y;
  })
  .attr("r", 4)
  .attr("display", displayMap);

links
  .selectAll("line.link")
  .data(root.links())
  .enter()
  .append("line")
  .classed("link", true)
  .attr("x1", function (d) {
    return d.source.x;
  })
  .attr("y1", function (d) {
    return d.source.y;
  })
  .attr("x2", function (d) {
    return d.target.x;
  })
  .attr("y2", function (d) {
    return d.target.y;
  });
export { mainNode };
