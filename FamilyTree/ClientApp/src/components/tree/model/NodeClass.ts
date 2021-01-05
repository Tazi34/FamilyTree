import { EntityId } from "@reduxjs/toolkit";

export type NodeId = string | number | null;

export class Node {
  id: EntityId;
  x: number;
  y: number;
  isVisible: boolean = true;
  isFamily: boolean;
  children: EntityId[] = [];
  fatherId: EntityId | null = null;
  motherId: EntityId | null = null;
  graph: number | undefined = undefined;

  treeId: number;

  constructor(
    id: EntityId,
    treeId: number,
    x: number,
    y: number,
    isFamily: boolean,
    children: EntityId[] = [],
    firstParent: EntityId | null = null,
    secondParent: EntityId | null = null
  ) {
    this.treeId = treeId;
    this.id = id;
    this.x = x;
    this.y = y;
    this.isFamily = isFamily;
    this.children = children;
    this.fatherId = firstParent;
    this.motherId = secondParent;
    if (this.fatherId === 0) {
      this.fatherId = null;
    }
    if (this.motherId === 0) {
      this.motherId = null;
    }
  }

  addParent = (parentId: number) => {
    if (this.fatherId && this.motherId) {
      throw "Node has both parents";
    }
    if (!this.fatherId) {
      this.fatherId = parentId;
    } else {
      this.motherId = parentId;
    }
  };
  addChild = (childId: number) => {
    if (!this.children.includes(childId)) {
      this.children.push(childId);
    }
  };
  removeChild = (childId: number) => {
    this.children.filter((child) => child != childId);
  };
}
