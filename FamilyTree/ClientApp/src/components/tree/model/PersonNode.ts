import { EntityId } from "@reduxjs/toolkit";
import { Sex } from "../../../model/Sex";
import { Node } from "./NodeClass";

export class PersonNode extends Node {
  personDetails: PersonInformation;
  families: EntityId[];
  userId: number | null;
  partners: EntityId[];
  canEdit?: boolean;

  constructor(
    id: EntityId,
    treeId: number,
    canEdit: boolean,
    personDetails: PersonInformation,
    x: number,
    y: number,
    children: EntityId[] = [],

    fatherId: EntityId | null = null,
    motherId: EntityId | null = null,
    families: EntityId[] = [],
    partners: EntityId[] = [],
    userId: number | null = null
  ) {
    super(id, treeId, x, y, false, children, fatherId, motherId);

    this.canEdit = canEdit;
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
  sex: Sex;
};

export const mockPerson: PersonInformation = {
  name: "Mock",
  surname: "Person",
  birthday: new Date().toString(),
  description: "",
  pictureUrl: "",
  sex: "Male",
};
