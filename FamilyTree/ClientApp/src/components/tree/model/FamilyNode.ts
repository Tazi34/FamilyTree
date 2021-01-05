import { RECT_HEIGHT } from "./../../../d3/RectMapper";
import { PersonNode } from "./PersonNode";
import { EntityId } from "@reduxjs/toolkit";
import { Point } from "../Point";
import { Node } from "./NodeClass";

export class FamilyNode extends Node {
  constructor(
    id: EntityId,
    treeId: number,
    x: number,
    y: number,
    children: EntityId[] = [],
    fatherId: EntityId | null = null,
    motherId: EntityId | null = null
  ) {
    super(id, treeId, x, y, true, children, fatherId, motherId);
  }
}

export const getFamilyLocation = (
  family: FamilyNode,
  firstParent: Point,
  secondParent?: Point
): Point => {
  let x: number;
  let y: number;
  if (firstParent && secondParent) {
    x =
      Math.min(firstParent.x, secondParent.x) +
      Math.abs(firstParent.x - secondParent.x) / 2;
    y =
      Math.min(firstParent.y, secondParent.y) +
      Math.abs(firstParent.y - secondParent.y) / 2;

    if (family.children.length > 0) {
      y += 200;
    }
  } else {
    x = firstParent.x;
    y = firstParent.y;
  }

  return { x, y };
};
