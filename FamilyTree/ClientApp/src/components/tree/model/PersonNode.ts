import { moveNode } from "../treeReducer";
import { EntityId } from "@reduxjs/toolkit";
import { RECT_HEIGHT, RECT_WIDTH } from "../../../d3/RectMapper";
import { Point } from "../treeReducer";
import { Node } from "./NodeClass";

export class PersonNode extends Node {
  personDetails: PersonInformation;
  families: EntityId[];
  getCanvasLocation = (): Point => {
    return {
      x: this.location.x - RECT_WIDTH / 2,
      y: this.location.y - RECT_HEIGHT / 2,
    };
  };
  constructor(
    id: EntityId,
    personDetails: PersonInformation,
    x: number,
    y: number,
    children: EntityId[] = [],
    firstParent: EntityId | null = null,
    secondParent: EntityId | null = null,
    families: EntityId[] = []
  ) {
    super(id, x, y, false, children, firstParent, secondParent);
    this.personDetails = personDetails;
    this.families = families;
  }
}

export type PersonInformation = {
  name: string;
  surname: string;
  birthDate: string;
};

export const mockPerson: PersonInformation = {
  name: "Mock",
  surname: "Person",
  birthDate: new Date().toString(),
};
