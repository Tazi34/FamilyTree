import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { ApplicationState } from "../../../../helpers";
import {
  HideBranchRequestData,
  HideBranchResponse,
} from "../../API/hideBranch/hideBranchRequest";
import { treeAPI } from "../../API/treeAPI";
import {
  selectAllFamilies,
  selectAllPersonNodes,
  setTree,
} from "../treeReducer";

type HideBranch = {
  familyId: string;
  treeId: number;
  show: boolean;
};
export const hideBranch = ({ show, familyId, treeId }: HideBranch) => (
  dispatch: any,
  getState: any
) => {
  const state: ApplicationState = getState();
  const nodes = selectAllPersonNodes(state);
  const families = selectAllFamilies(state);

  const hiddenNodes = nodes
    .filter((n) => n.hidden)
    .map((a) => a.id) as number[];
  const hiddenFamilies = families
    .filter((f) => f.hidden)
    .map((a) => a.id) as string[];
  const data: HideBranchRequestData = {
    treeId,
    show,
    families: [familyId],
    hiddenFamilies,
    hiddenNodes,
  };

  dispatch(hideBranchThunk(data)).then((response: any) => {
    if (response.type === hideBranchThunk.fulfilled.toString()) {
      dispatch(setTree(response.payload.data));
    }
  });
};
export const hideBranchThunk = createAsyncThunk<
  AxiosResponse<HideBranchResponse>,
  HideBranchRequestData
>("tree/nodes/hide", async (data) => {
  return treeAPI.hideBranchRequest(data);
});
