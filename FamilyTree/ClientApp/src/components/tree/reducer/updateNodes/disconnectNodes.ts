import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import {
  DisconnectNodeRequestData,
  DisconnectNodeResponse,
} from "../../API/disconnectNode/disconnectNode";
import { treeAPI } from "../../API/treeAPI";
import {
  personNodesActionsPrefix,
  setTree,
  treeActionsPrefix,
} from "../treeReducer";

export const disconnectNode = createAsyncThunk<
  AxiosResponse<DisconnectNodeResponse>,
  DisconnectNodeRequestData
>(
  `${treeActionsPrefix}/${personNodesActionsPrefix}/disconnectNode`,
  async (disconnectNodeRequestData: DisconnectNodeRequestData) => {
    return await treeAPI.disconnectNodeRequest(disconnectNodeRequestData);
  }
);

export const requestDisconnectNode = (nodes: number[]) => (dispatch: any) => {
  dispatch(disconnectNode({ nodes })).then((response: any) => {
    if (response.type === disconnectNode.fulfilled.toString()) {
      dispatch(setTree(response.payload.data));
    }
  });
};
