import { EntityState } from "@reduxjs/toolkit";
import { PersonInformation } from "../components/tree/model/PersonNode";

export interface Person {
  id: number;
  treeId: number;
  fatherId: number | null;
  motherId: number | null;
  information: PersonInformation;
  children: number[];
  partners: number[];
  graph?: number;
  families?: string[];
}

export interface Family {
  firstParent: number | null;
  secondParent: number | null;
  children: number[];
  id: string;
}

export interface TreeStructure {
  people: EntityState<Person>;
  links: string[][];
  families: Family[];
}
export interface PeopleCollection {
  [key: number]: Person;
}

export interface WorkPersonNode {
  id: string;
  neighbours: string[];
  graph?: number;
}
