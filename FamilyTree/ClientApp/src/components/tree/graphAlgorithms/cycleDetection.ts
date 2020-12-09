import { Node } from "../model/NodeClass";
import { EntityId } from "@reduxjs/toolkit";
import { PersonNode } from "../model/PersonNode";

import { IDictionary } from "../TreeRenderer";

export const isGraphCyclic = (nodes: Node[]): boolean => {
  const visited: IDictionary<boolean> = {};
  const nodesMapping: IDictionary<Node> = {};
  nodes.forEach((node) => {
    visited[node.id] = false;
    nodesMapping[node.id] = node;
  });

  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index];

    if (!visited[node.id]) {
      if (isCyclicRec(node, nodesMapping, visited, -1)) {
        return true;
      }
    }
  }

  return false;
};

const isCyclicRec = (
  node: Node,
  nodes: IDictionary<Node>,
  visited: IDictionary<boolean>,
  parent: EntityId
): boolean => {
  visited[node.id] = true;

  var neighbours: EntityId[];
  if (node instanceof PersonNode) {
    neighbours = node.families;
  } else {
    neighbours = [node.firstParent, node.secondParent, ...node.children].filter(
      (a) => a
    ) as EntityId[];
  }

  for (let index = 0; index < neighbours.length; index++) {
    const neighbourId = neighbours[index];
    if (!visited[neighbourId]) {
      if (isCyclicRec(nodes[neighbourId], nodes, visited, node.id)) {
        return true;
      }
    } else if (neighbourId != parent) {
      return true;
    }
  }

  return false;
};
