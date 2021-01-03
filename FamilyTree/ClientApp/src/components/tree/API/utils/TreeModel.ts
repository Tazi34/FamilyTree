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
};

export type TreeAPI = {
  treeId: number;
  name: string;
  isPrivate: true;
  nodes: TreeNodeAPI[];
};
