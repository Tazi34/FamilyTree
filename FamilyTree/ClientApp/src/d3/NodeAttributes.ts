import { linkEndX, linkEndY, linkStartX, linkStartY } from "./LinkMapper";
import {
  displayMap,
  rectFill,
  rectStroke,
  rectX,
  rectY,
  RECT_HEIGHT,
  RECT_WIDTH,
} from "./RectMapper";
export const X = "x";
export const Y = "y";
export const C_X = "cx";
export const C_Y = "cy";
export const WIDTH = "width";
export const HEIGHT = "height";
export const DISPLAY = "display";
export const COLOR = "color";
export const LINE_START_X = "x1";
export const LINE_START_Y = "y1";
export const LINE_END_X = "x2";
export const LINE_END_Y = "y2";
export const STYLE = "style";
export const STROKE = "stroke";
export const FILL = "fill";
export const RECTANGLE_BORDER_RADIUS = "rx";
export const IMAGE = "image";

export const rectangleAttributes: any = {
  [WIDTH]: RECT_WIDTH + "px",
  [HEIGHT]: RECT_HEIGHT + "px",
  [DISPLAY]: displayMap,
  [STROKE]: rectStroke,
  [FILL]: rectFill,
  [RECTANGLE_BORDER_RADIUS]: "10",
};
export const linkAttributes: any = {
  [LINE_START_X]: linkStartX,
  [LINE_START_Y]: linkStartY,
  [LINE_END_X]: linkEndX,
  [LINE_END_Y]: linkEndY,
  [STYLE]: "stroke:rgb(255,0,0);stroke-width:2",
};
export const emptyNodeAttributs: any = {
  [WIDTH]: 0,
  [HEIGHT]: 0,
  [DISPLAY]: displayMap,
  [X]: rectX,
  [Y]: rectY,
};
