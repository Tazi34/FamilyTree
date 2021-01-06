import axios from "axios";
import { baseURL } from "../../../../helpers/apiHelpers";
import { TreeInformation } from "./../../../../model/TreeInformation";
import { TreeAPI } from "./../utils/TreeModel";

export type ChangeTreeNameRequestData = TreeInformation;

export type ChangeTreeNameResponse = TreeAPI;

export const changeTreeNameRequest = (data: ChangeTreeNameRequestData) => {
  return axios.put(`${baseURL}/tree`, data);
};
