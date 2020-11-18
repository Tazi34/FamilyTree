import data from "../../../samples/complex.json";
import { rectHeight, rectWidth } from "../AttributesMappers/RectMapper";
import { initializeLinks, initializeNodes } from "../D3Initializers";
const d3_base = require("d3");
const d3_dag = require("d3-dag");
const d3 = Object.assign({}, d3_base, d3_dag);

var linksData = [];
data.forEach((element) => {
  if (element.firstParent) {
    linksData.push([element.firstParent.toString(), element.id.toString()]);
  }
  if (element.secondParent) {
    linksData.push([element.secondParent.toString(), element.id.toString()]);
  }
});

var mainNode = document.createElement("div");
mainNode.className = "tree";
const screen_height = 800;
const screen_width = 1400;
const svg = d3
  .select(mainNode)
  .append("svg")
  .attr("width", screen_width)
  .attr("height", screen_height);

// helper variables
var i = 0,
  duration = 750,
  x_sep = rectWidth + 60,
  y_sep = rectHeight + 100;

// declare a dag layout
var tree = d3
  .sugiyama()
  .nodeSize([x_sep, y_sep])
  .layering(d3.layeringSimplex())
  .decross(d3.twolayerOpt)
  .coord(d3.coordVert())
  .separation((a, b) => {
    return 1;
  });

// make dag from edge list
const dag = d3.dagConnect()(linksData);

// in order to make the family tree work, the dag
// must be a node with id undefined. create that node if
// not done automaticaly
var root;
if (dag.id != undefined) {
  root = dag.copy();
  root.id = undefined;
  root.children = [dag];
  dag = root;
}

// prepare node data

// overwrite dag root nodes
var root = tree(dag);
var nodes = dag.descendants();

var links = svg.append("g").attr("class", "links");
var nodes = svg.append("g").attr("class", "nodes");

initializeNodes(nodes, root.descendants());
initializeLinks(links, root.links());

export { mainNode };
