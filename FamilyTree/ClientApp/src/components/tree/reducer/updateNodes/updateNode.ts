import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { treeAPI } from "../../API/treeAPI";
import { UpdateNodeResponse } from "../../API/updateNode/updateNodeRequest";
import { setTree, treeActionsPrefix } from "../treeReducer";
import { UpdateNodeRequestData } from "./../../API/updateNode/updateNodeRequest";

export const updateTreeNode = (data: UpdateNodeRequestData) => (
  dispatch: any
) => {
  return dispatch(updateTreeNodeRequest(data)).then((resp: any) => {
    if (resp.type === updateTreeNodeRequest.fulfilled.toString()) {
      return dispatch(setTree(resp.payload.data));
    }
    return resp;
  });
};
export const updateTreeNodeRequest = createAsyncThunk<
  AxiosResponse<UpdateNodeResponse>,
  UpdateNodeRequestData
>(`${treeActionsPrefix}/updateNode`, async (updateNodeData) => {
  updateNodeData.birthday = new Date(updateNodeData.birthday).toISOString();
  return await treeAPI.updateTreeNode(updateNodeData);
});
