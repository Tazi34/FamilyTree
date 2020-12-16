import { EntityId } from "@reduxjs/toolkit";
import { Node } from "./NodeClass";

export class FamilyNode extends Node {
  constructor(
    id: EntityId,
    treeId: number,
    x: number,
    y: number,
    children: EntityId[] = [],
    firstParent: EntityId | null = null,
    secondParent: EntityId | null = null
  ) {
    super(id, treeId, x, y, true, children, firstParent, secondParent);
  }
}
