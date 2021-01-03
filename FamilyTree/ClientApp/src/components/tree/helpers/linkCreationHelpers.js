import * as d3 from "d3";
import { getLinkId } from "./idHelpers";

export const createPath = (p1x, p1y, p2x, p2y) => {
  // mid-point of line:
  var mpx = (p2x + p1x) * 0.5;
  var mpy = (p2y + p1y) * 0.5;

  // angle of perpendicular to line:
  var theta = Math.atan2(p2y - p1y, p2x - p1x) - Math.PI / 2;

  // distance of control point from mid-point of line:
  var offset = 30;

  // location of control point:
  var c1x = mpx + offset * Math.cos(theta);
  var c1y = mpy + offset * Math.sin(theta);

  var curve =
    "M" + p1x + " " + p1y + " Q " + c1x + " " + c1y + " " + p2x + " " + p2y;

  // var yDif = p2y - p1y;
  // var xDif = p2x - p1x;

  // var pathData = d3.path();
  // pathData.moveTo(p1x, p1y);
  // pathData.bezierCurveTo(p1x, p1y + 0.5 * yDif, p2x, p1y + 0.5 * yDif, p2x, p2y);
  return curve;
};

var colorArray = ["black", "red", "blue", "green", "purple", "pink"];
