import { EntityId } from "@reduxjs/toolkit";
import { Node } from "./NodeClass";

export class FamilyNode extends Node {
  constructor(
    id: EntityId,
    x: number,
    y: number,
    children: EntityId[] = [],
    firstParent: EntityId | null = null,
    secondParent: EntityId | null = null
  ) {
    super(id, x, y, true, children, firstParent, secondParent);
  }
}
