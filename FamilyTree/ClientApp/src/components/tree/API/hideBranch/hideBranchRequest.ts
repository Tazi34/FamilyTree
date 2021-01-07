import { TreeAPI } from "./../utils/TreeModel";
import axios from "axios";
import { TREE_API_URL } from "../../../../helpers/apiHelpers";

export const HIDE_BRANCH_API_URL = `${TREE_API_URL}/hide`;

export type HideBranchRequestData = {
  families: string[];
  show: boolean;
  treeId: number;
  hiddenFamilies: string[];
  hiddenNodes: number[];
};

export type HideBranchResponse = TreeAPI;

export const hideBranchRequest = (data: HideBranchRequestData) => {
  return axios.post<HideBranchResponse>(`${HIDE_BRANCH_API_URL}`, data);
};
