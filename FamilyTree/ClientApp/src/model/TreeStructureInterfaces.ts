export interface Person {
  id: number;
  firstParent?: number;
  secondParent?: number;
  information: PersonData;
  canBeDeleted?: boolean;
  children: number[];
  partners: Person[];
  graph?: number;
  links?: string[][];
}

export interface Family {
  firstParent?: number;
  secondParent?: number;
  children: number[];
  id: string;
}
export interface PersonData {
  name: string;
  surname: string;
  birthDate: string;
}
export interface TreeStructure {
  people: PeopleCollection;
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
