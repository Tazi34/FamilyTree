import { createAction } from "@reduxjs/toolkit";
import { Node } from "../../model/NodeClass";
import { treeActionsPrefix, personNodesActionsPrefix } from "../treeReducer";

export const moveNode = createAction(
  `${treeActionsPrefix}/${personNodesActionsPrefix}/nodeMoved`,
  (node: Node, x: number, y: number): any => ({
    payload: { node, x, y },
  })
);
