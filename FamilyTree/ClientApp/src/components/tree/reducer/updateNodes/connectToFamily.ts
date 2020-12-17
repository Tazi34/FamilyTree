import { createAction, EntityId } from "@reduxjs/toolkit";
import { ApplicationState } from "../../../../helpers/index";
import { UpdateNodeRequestData } from "../../API/updateNode/updateNodeRequest";
import { treeNodeMapper } from "../../API/utils/NodeMapper";
import {
  treeActionsPrefix,
  personNodesLocalSelectors,
  familyNodesLocalSelectors,
} from "../treeReducer";
import { updateTreeNode } from "./updateNode";

export const connectToFamily = createAction(
  `${treeActionsPrefix}/connectedToFamily`,
  (childId: EntityId, familyId: EntityId): any => ({
    payload: { childId, familyId },
  })
);
export const connectToFamilyAsync = (childId: EntityId, familyId: EntityId) => (
  dispatch: any,
  getState: any
) => {
  const state: ApplicationState = getState();
  const child = personNodesLocalSelectors.selectById(state.tree.nodes, childId);
  if (!child) {
    throw "Unrecognized child node " + childId;
  }

  const family = familyNodesLocalSelectors.selectById(
    state.tree.families,
    familyId
  );
  if (!family) {
    throw `Family ${familyId} does not exits`;
  }

  const updateNodeData: UpdateNodeRequestData = treeNodeMapper.mapToAPI(child);
  updateNodeData.fatherId = (family.firstParent ?? 0) as number;
  updateNodeData.motherId = (family.secondParent ?? 0) as number;

  dispatch(updateTreeNode(updateNodeData)).then(() =>
    dispatch(connectToFamily(childId, familyId))
  );
};
