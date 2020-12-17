import { EntityId } from "@reduxjs/toolkit";
import { Point } from "../Point";

export type NodeId = string | number | null;

export class Node {
  id: EntityId;
  location: Point;
  isVisible: boolean = true;
  isFamily: boolean;
  children: EntityId[] = [];
  firstParent: EntityId | null = null;
  secondParent: EntityId | null = null;
  graph: number | undefined = undefined;
  d3Node: any;
  treeId: number;
  getCanvasLocation = (): Point => {
    return this.location;
  };

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
    this.location = { x, y };
    this.isFamily = isFamily;
    this.children = children;
    this.firstParent = firstParent;
    this.secondParent = secondParent;
    if (this.firstParent === 0) {
      this.firstParent = null;
    }
    if (this.secondParent === 0) {
      this.secondParent = null;
    }
  }

  addParent = (parentId: number) => {
    if (this.firstParent && this.secondParent) {
      throw "Node has both parents";
    }
    if (!this.firstParent) {
      this.firstParent = parentId;
    } else {
      this.secondParent = parentId;
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
