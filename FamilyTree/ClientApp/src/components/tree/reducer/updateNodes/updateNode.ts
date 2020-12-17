import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { treeAPI } from "../../API/treeAPI";
import {
  UpdateNodeRequestData,
  UpdateNodeResponse,
} from "../../API/updateNode/updateNodeRequest";
import { treeActionsPrefix } from "../treeReducer";

export const updateTreeNode = createAsyncThunk<
  AxiosResponse<UpdateNodeResponse>,
  UpdateNodeRequestData
>(`${treeActionsPrefix}/updateNode`, async (updateNodeData) => {
  return await treeAPI.updateTreeNode(updateNodeData);
});