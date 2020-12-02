export interface TreeNode {
  children: TreeNode[];
  data: NodeData;
  depth: number;
  height: number;
  x: number;
  y: number;
}

export interface NodeData {
  generation: number;
  nodeId: number;
  person: PersonData;
  style: StyleData;
  children: NodeData[];
}

export interface PersonData {
  name: string;
  surname: string;
  birthDate: string;
}
export interface StyleData {
  display: boolean;
}
