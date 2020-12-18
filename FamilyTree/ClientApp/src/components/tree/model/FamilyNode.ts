import { EntityId } from "@reduxjs/toolkit";
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
