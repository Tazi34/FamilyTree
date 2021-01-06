import axios from "axios";
import { baseURL } from "../../../../helpers/apiHelpers";
import { TreeAPI } from "./../utils/TreeModel";

export type ConnectPartnersRequestData = {
  firstPartnerId: number;
  secondPartnerId: number;
};

export type ConnectPartnersResponse = TreeAPI;

export const connectPartnersRequest = (data: ConnectPartnersRequestData) => {
  return axios.post(`${baseURL}/tree/node/connect/partner`, data);
};
