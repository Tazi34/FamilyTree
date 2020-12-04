import * as d3 from "d3";
import { getLinkId } from "./idHelpers";

export const createPath = (x1, y1, x2, y2) => {
  var yDif = y2 - y1;
  var xDif = x2 - x1;

  var pathData = d3.path();
  pathData.moveTo(x1, y1);
  pathData.bezierCurveTo(x1, y1 + 0.5 * yDif, x2, y1 + 0.5 * yDif, x2, y2);
  return pathData;
};

var colorArray = ["black", "red", "blue", "green", "purple", "pink"];
