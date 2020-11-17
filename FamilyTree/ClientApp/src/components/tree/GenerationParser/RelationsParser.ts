import { NodeData } from "../TreeInterfaces";
interface Relation {
  parent: number;
  children: number[];
}
interface GenerationInfo {
  personId: number;
  generation: number;
  children: number[];
}
const setGenerations = (data: Relation[]) => {
  var nodes = new Map<number, GenerationInfo>();
  var generationCounter = 0;
  data.forEach((relation) => {
    if (!nodes.has(relation.parent)) {
      const newNode = {
        personId: relation.parent,
        generation: -1,
        children: relation.children,
      };
      nodes.set(relation.parent, newNode);
    }
    var currentNode = nodes.get(relation.parent);
  });
};
