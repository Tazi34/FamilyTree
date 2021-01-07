import axios from "axios";
import { TREE_API_URL } from "../../../../helpers/apiHelpers";
import { TreeNodeAPI } from "./../utils/TreeModel";

export const DISCONNECT_NODE_API_URL = `${TREE_API_URL}/detach`;

export type DisconnectNodeRequestData = {
  nodes: number[];
};

export type DisconnectNodeResponse = TreeNodeAPI;

export const disconnectNodeRequest = (data: DisconnectNodeRequestData) => {
  return axios.post<DisconnectNodeResponse>(`${DISCONNECT_NODE_API_URL}`, data);
};
