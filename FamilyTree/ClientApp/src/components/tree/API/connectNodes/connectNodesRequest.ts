import axios from "axios";
import { baseURL } from "../../../../helpers/apiHelpers";
import { TreeAPI } from "./../utils/TreeModel";

export type ConnectNodesRequestData = {
  treeId: number;
  childId: number;
  firstParentId: number;
  secondParentId?: number;
};

export type ConnectNodesResponse = TreeAPI;

export const connectNodesRequest = (data: ConnectNodesRequestData) => {
  return axios.post(`${baseURL}/tree/node/connect`, data);
};
