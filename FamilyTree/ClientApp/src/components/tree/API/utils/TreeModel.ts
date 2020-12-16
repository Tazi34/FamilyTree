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
};

export type TreeAPI = {
  treeId: number;
  name: string;
  isPrivate: true;
  nodes: TreeNodeAPI[];
};
