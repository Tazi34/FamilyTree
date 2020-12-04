import * as d3 from "d3";
import { getLinkId } from "./idHelpers";
export const createLinks = (links) => {
  links.each(function (link) {
    if (!link.source.isVisible || !link.target.isVisible) {
      return;
    }

    var pathData = createPath(link);

    d3.select(this)
      .append("g")
      .attr("class", "link")
      .attr("id", (link) => {
        return getLinkId(link.source.id, link.target.id);
      })
      .append("path")
      .attr("d", pathData)
      .attr("fill", "none")
      .attr("stroke", (d) => {
        var graphIndex = 3;
        //TODO
        var graphIndex = link.source.data.graph
          ? link.source.data.graph
          : link.target.data.graph;

        return "black";
      })
      .attr("stroke-width", 1);
  });
};

export const createPath = (link) => {
  var yDif = link.target.y - link.source.y;
  var xDif = link.target.x - link.source.x;

  var pathData = d3.path();
  pathData.moveTo(link.source.x, link.source.y);
  pathData.bezierCurveTo(
    link.source.x,
    link.source.y + 0.5 * yDif,
    link.target.x,
    link.source.y + 0.5 * yDif,
    link.target.x,
    link.target.y
  );
  return pathData;
};
var colorArray = ["black", "red", "blue", "green", "purple", "pink"];
