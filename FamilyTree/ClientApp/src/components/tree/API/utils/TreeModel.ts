import { Sex } from "../../../../model/Sex";

export type TreeNodeAPI = {
  nodeId: number;
  userId: number;
  treeId: number;
  birthday: string;
  description: string;
  name: string;
  surname: string;
  pictureUrl: string;
  fatherId: number;
  motherId: number;
  children: number[];
  partners: number[];
  sex: Sex;
  x: number;
  y: number;
  families: string[];
};

export type TreeAPI = {
  treeId: number;
  name: string;
  isPrivate: true;
  nodes: TreeNodeAPI[];
  links: LinkAPI[];
  families: FamilyAPI[];
};

export type LinkAPI = {
  id: string;
  source: string;
  target: string;
};
export type FamilyAPI = {
  id: string;
  treeId: number;
  firstParentId: number;
  secondParentId: number;
  children: number[];
  x: number;
  y: number;
};
