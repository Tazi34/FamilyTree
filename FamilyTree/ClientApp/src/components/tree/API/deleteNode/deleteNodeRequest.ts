import axios from "axios";
import { TREE_API_URL } from "../../../../helpers/apiHelpers";
import { TreeNodeAPI } from "./../utils/TreeModel";

export const DELETE_NODE_API_URL = `${TREE_API_URL}/node`;

export type DeleteNodeRequestData = {
  nodeId: number;
};

export type DeleteNodeResponse = TreeNodeAPI;

export const deleteTreeNode = (data: DeleteNodeRequestData) => {
  return axios.delete<DeleteNodeResponse>(
    `${DELETE_NODE_API_URL}/${data.nodeId}`
  );
};
