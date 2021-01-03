import axios from "axios";
import { TREE_API_URL } from "../../../../helpers/apiHelpers";
import { CreateNodeRequestData } from "../createNode/createNodeRequest";
import { TreeNodeAPI } from "../utils/TreeModel";

export const ADD_SIBLING_NODE_API_URL = `${TREE_API_URL}/node/addSibling`;

export type AddSiblingRequestData = {
  newNode: CreateNodeRequestData;
  siblingId: number;
};

export type AddSiblingResponse = TreeNodeAPI;

export const addSiblingTreeNode = (data: AddSiblingRequestData) => {
  return axios.post<AddSiblingResponse>(ADD_SIBLING_NODE_API_URL, data);
};
