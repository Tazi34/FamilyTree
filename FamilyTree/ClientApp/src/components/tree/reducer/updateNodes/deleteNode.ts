import { AxiosResponse } from "axios";
import { createAsyncThunk, EntityId } from "@reduxjs/toolkit";
import { ApplicationState } from "../../../../helpers";
import { createActionWithPayload } from "../../../../helpers/helpers";
import {
  DeleteNodeRequestData,
  DeleteNodeResponse,
} from "../../API/deleteNode/deleteNodeRequest";
import { treeAPI } from "../../API/treeAPI";
import { PersonNode } from "../../model/PersonNode";
import { treeActionsPrefix, personNodesActionsPrefix } from "../treeReducer";

export const removeNodeFromTree = createActionWithPayload<EntityId>(
  `${treeActionsPrefix}/${personNodesActionsPrefix}/nodeRemoved`
);
export const deleteNode = createAsyncThunk<
  AxiosResponse<DeleteNodeResponse>,
  DeleteNodeRequestData
>(
  `${treeActionsPrefix}/${personNodesActionsPrefix}/deleteNode`,
  async (deleteNodeRequestData: DeleteNodeRequestData) => {
    return await treeAPI.deleteTreeNode(deleteNodeRequestData);
  }
);
export const requestDeleteNode = (nodeId: EntityId) => (
  dispatch: any,
  getState: any
) => {
  const state: ApplicationState = getState();

  dispatch(deleteNode({ nodeId: nodeId as number })).then((response: any) => {
    if (response.type === deleteNode.fulfilled.toString()) {
      dispatch(removeNodeFromTree(nodeId));
    }
  });
};
