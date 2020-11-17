import {
  linkEndX,
  linkStartX,
  linkStartY,
  linkEndY,
} from "./AttributesMappers/LinkMapper";
import {
  displayMap,
  rectHeight,
  rectStroke,
  rectWidth,
  rectX,
  rectY,
} from "./AttributesMappers/RectMapper";
import {
  HEIGHT,
  LINE_END_X,
  LINE_START_X,
  LINE_START_Y,
  LINE_END_Y,
  WIDTH,
  X,
  Y,
  DISPLAY,
  STROKE,
  FILL,
  STYLE,
} from "./NodeAttributes";
import { TreeNode } from "./TreeInterfaces";

//definicja atrybutow na wezle svg
const rectangleAttributes: any = {
  [WIDTH]: rectWidth,
  [HEIGHT]: rectHeight,
  [DISPLAY]: displayMap,
  [X]: rectX,
  [Y]: rectY,
  [STROKE]: rectStroke,
  [FILL]: "none",
};

const initializeNodes = (nodes: any, data: any) => {
  var nodesSelector = nodes
    .selectAll("circle.node")
    .data(data)
    .enter()
    .append("rect")
    .classed("node", true);

  for (const key in rectangleAttributes) {
    nodesSelector = nodesSelector.attr(key, rectangleAttributes[key]);
  }
  nodes
    .selectAll("circle.node")
    .data(data)
    .enter()
    .append("text")
    .attr("x", (d: any) => d.x)
    .attr("y", (d: any) => d.y + 30)
    .text((d: any) => d.id);
  return nodes;
};

const linkAttributes: any = {
  [LINE_START_X]: linkStartX,
  [LINE_START_Y]: linkStartY,
  [LINE_END_X]: linkEndX,
  [LINE_END_Y]: linkEndY,
  [STYLE]: "stroke:rgb(255,0,0);stroke-width:2",
};
const initializeLinks = (links: any, data: any): any => {
  var linksSelector = links
    .selectAll("line.link")
    .data(data)
    .enter()
    .append("line")
    .classed("link", true);

  for (const key in linkAttributes) {
    if (Object.prototype.hasOwnProperty.call(linkAttributes, key)) {
      linksSelector = linksSelector.attr(key, linkAttributes[key]);
    }
  }
  return links;
};

export { initializeNodes, initializeLinks };
