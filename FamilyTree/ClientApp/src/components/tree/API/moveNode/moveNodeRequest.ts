import axios from "axios";
import { TREE_API_URL } from "../../../../helpers/apiHelpers";

export const MOVE_NODE_API_URL = `${TREE_API_URL}/node/move`;

export type MoveNodeRequestData = {
  nodeId: number;
  x: number;
  y: number;
};

export type MoveNodeResponse = {
  nodeId: number;
  x: number;
  y: number;
};

export const moveTreeNode = (data: MoveNodeRequestData) => {
  return axios.put<MoveNodeResponse>(`${MOVE_NODE_API_URL}`, data);
};
