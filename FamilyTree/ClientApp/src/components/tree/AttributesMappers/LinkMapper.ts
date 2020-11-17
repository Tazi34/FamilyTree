import { TreeNode } from "../TreeInterfaces";
import { rectHeight, rectWidth } from "./RectMapper";

export const linkStartX = (d: any) => {
  if (isNodeVisible(d.source) && isNodeVisible(d.target)) {
    return d.source.x + rectWidth / 2;
  }
  return null;
};

export const linkStartY = (d: any) => {
  if (isNodeVisible(d.source) && isNodeVisible(d.target)) {
    return d.source.y + rectHeight;
  }
  return null;
};
export const linkEndX = (d: any) => {
  if (isNodeVisible(d.source) && isNodeVisible(d.target)) {
    return d.target.x + rectWidth / 2;
  }
  return null;
};
export const linkEndY = (d: any) => {
  if (isNodeVisible(d.source) && isNodeVisible(d.target)) {
    return d.target.y;
  }
  return null;
};

const isNodeVisible = (node: TreeNode): boolean => {
  return true;
  return node.data.style.display == null || node.data.style.display;
};
