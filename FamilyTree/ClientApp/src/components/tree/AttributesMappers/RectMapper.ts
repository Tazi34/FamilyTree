import { TreeNode } from "../TreeInterfaces";
export const rectWidth = 100;
export const rectHeight = 100;

export const displayMap = function (node: TreeNode): string {
  if (node.data && node.data.style) {
    switch (node.data.style.display) {
      case true:
        return "true";
      case false:
        return "none";
    }
  }
  return "true";
};

export const rectX = function (node: TreeNode): number {
  return node.x;
};
export const rectY = function (node: TreeNode): number {
  return node.y;
};

export const rectFill = (node: TreeNode): string => {
  return "transparent";
};

export const rectStroke = (node: TreeNode): string => {
  return "#529587";
};
