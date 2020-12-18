import { FamilyNode } from "./../components/tree/model/FamilyNode";
import { PersonNode } from "./../components/tree/model/PersonNode";
import { EntityId, EntityState } from "@reduxjs/toolkit";
import { PersonInformation } from "../components/tree/model/PersonNode";

export interface Person {
  id: number;
  treeId: number;
  fatherId: number | null;
  motherId: number | null;
  personDetails: PersonInformation;
  children: number[];
  partners: number[];
  graph?: number;
  families?: string[];
}

export interface Family {
  fatherId: EntityId | null;
  motherId: EntityId | null;
  children: EntityId[];
  id: string;
}

export interface TreeStructure {
  people: EntityState<PersonNode>;
  links: string[][];
  families: FamilyNode[];
}
export interface PeopleCollection {
  [key: number]: Person;
}

export interface WorkPersonNode {
  id: string;
  neighbours: string[];
  graph?: number;
}
