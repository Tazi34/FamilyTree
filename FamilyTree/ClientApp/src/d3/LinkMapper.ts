import { TreeNode } from "../model/TreeInterfaces";
import { RECT_HEIGHT, RECT_WIDTH } from "./RectMapper";

export const linkStartX = (d: any) => {
  if (d.source.isFamily) {
    return d.source.x;
  }
  return d.source.x + RECT_WIDTH / 2;
};

export const linkStartY = (d: any) => {
  if (d.source.isFamily) {
    return d.source.y;
  }
  return d.source.y + RECT_HEIGHT;
};
export const linkEndX = (d: any) => {
  if (d.target.isFamily) {
    return d.target.x;
  }
  return d.target.x + RECT_WIDTH / 2;
};
export const linkEndY = (d: any) => {
  if (d.target.isFamily) {
    return d.target.y;
  }
  return d.target.y;
};
