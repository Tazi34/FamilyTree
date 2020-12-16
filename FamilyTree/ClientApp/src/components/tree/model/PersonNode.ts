import { moveNode } from "../treeReducer";
import { EntityId } from "@reduxjs/toolkit";
import { RECT_HEIGHT, RECT_WIDTH } from "../../../d3/RectMapper";
import { Point } from "../treeReducer";
import { Node } from "./NodeClass";

export class PersonNode extends Node {
  personDetails: PersonInformation;
  families: EntityId[];
  userId: number | null;
  partners: EntityId[];
  getCanvasLocation = (): Point => {
    return {
      x: this.location.x - RECT_WIDTH / 2,
      y: this.location.y - RECT_HEIGHT / 2,
    };
  };
  constructor(
    id: EntityId,
    treeId: number,
    personDetails: PersonInformation,
    x: number,
    y: number,
    children: EntityId[] = [],
    firstParent: EntityId | null = null,
    secondParent: EntityId | null = null,
    families: EntityId[] = [],
    partners: EntityId[] = [],
    userId: number | null = null
  ) {
    super(id, treeId, x, y, false, children, firstParent, secondParent);

    this.personDetails = personDetails;
    this.families = families;
    this.userId = userId;
    this.partners = partners;
  }
}

export type PersonInformation = {
  name: string;
  surname: string;
  birthday: string;
  description: string;
  pictureUrl: string;
};

export const mockPerson: PersonInformation = {
  name: "Mock",
  surname: "Person",
  birthday: new Date().toString(),
  description: "",
  pictureUrl: "",
};
