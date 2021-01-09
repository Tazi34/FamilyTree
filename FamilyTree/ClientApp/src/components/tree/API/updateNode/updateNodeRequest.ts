import { TreeAPI } from "./../utils/TreeModel";
import axios from "axios";
import { baseURL, TREE_API_URL } from "../../../../helpers/apiHelpers";
import { Sex } from "../../../../model/Sex";

export const UPDATE_NODE_API_URL = `${TREE_API_URL}/node`;

export type UpdateNodeRequestData = {
  nodeId: number;
  userId: number;
  treeId: number;
  birthday: string;
  description: string;
  name: string;
  surname: string;
  fatherId: number;
  motherId: number;
  children: number[];
  partners: number[];
  sex: Sex;
};

export type UpdateNodeResponse = TreeAPI;

export const updateTreeNode = (data: UpdateNodeRequestData) => {
  return axios.put<UpdateNodeResponse>(UPDATE_NODE_API_URL, data);
};
