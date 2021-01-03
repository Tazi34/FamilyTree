import { createAsyncThunk, EntityId } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { RECT_WIDTH } from "../../../../d3/RectMapper";
import { ApplicationState } from "../../../../helpers";
import { CreateNodeRequestData } from "../../API/createNode/createNodeRequest";
import { personNodesLocalSelectors, setTree } from "../treeReducer";
import {
  AddSiblingRequestData,
  AddSiblingResponse,
} from "./../../API/addSibling/addSiblingRequest";
import { treeAPI } from "./../../API/treeAPI";
export const addSiblingRequest = (
  siblingId: EntityId,
  newPerson: CreateNodeRequestData
) => (dispatch: any, getState: any) => {
  const state: ApplicationState = getState();
  const sibling = personNodesLocalSelectors.selectById(
    state.tree.nodes,
    siblingId
  );
  if (!sibling) {
    throw "Missing sibling source " + siblingId;
  }

  newPerson.x = sibling.x + 2 * RECT_WIDTH;
  newPerson.y = sibling.y;

  const data: AddSiblingRequestData = {
    newNode: newPerson,
    siblingId: siblingId as number,
  };
  dispatch(addSibling(data)).then((response: any) => {
    if (response.type === addSibling.fulfilled.toString()) {
      dispatch(setTree(response.payload.data));
    }
  });
};

export const addSibling = createAsyncThunk<
  AxiosResponse<AddSiblingResponse>,
  AddSiblingRequestData
>(`tree/node/addSibling`, async (data) => {
  return await treeAPI.addSiblingTreeNode(data);
});
