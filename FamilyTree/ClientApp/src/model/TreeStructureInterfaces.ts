import { EntityState } from "@reduxjs/toolkit";
import { FamilyNode, Link } from "../components/tree/neww/model/treeReducer";

export interface Person {
  id: number;
  firstParent: number | null;
  secondParent: number | null;
  information: PersonData;
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
export interface PersonData {
  name: string;
  surname: string;
  birthDate: string;
}
export interface TreeStructure {
  people: EntityState<Person>;
  links: string[][];
  families: Family[];
}
export interface PeopleCollection {
  [key: number]: Person;
}

export interface PersonNode {
  id: string;
  neighbours: string[];
  graph?: number;
}
