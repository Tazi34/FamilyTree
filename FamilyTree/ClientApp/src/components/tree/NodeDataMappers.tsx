interface TreeNode {
  children: TreeNode[];
  data: NodeData;
  depth: number;
  height: number;
  x: number;
  y: number;
}

interface NodeData {
  nodeId: number;
  person: PersonData;
  style: StyleData;
  children: NodeData[];
}

interface PersonData {
  name: string;
  surname: string;
  birthDate: string;
}
interface StyleData {
  display: boolean;
}

const displayMap = function (node: TreeNode): string {
  if (node.data.style) {
    switch (node.data.style.display) {
      case true:
        return "true";
      case false:
        return "none";
    }
  }
  return "true";
};

export { displayMap };
