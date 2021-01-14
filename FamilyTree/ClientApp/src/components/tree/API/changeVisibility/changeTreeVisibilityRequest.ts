import axios from "axios";
import { baseURL } from "../../../../helpers/apiHelpers";
import { TreeInformation } from "./../../../../model/TreeInformation";
import { TreeAPI } from "./../utils/TreeModel";

export type ChangeTreeVisibilityRequestData = TreeInformation;

export type ChangeTreeVisibilityResponse = TreeAPI;

export const changeTreeVisibilityRequest = (
  data: ChangeTreeVisibilityRequestData
) => {
  return axios.put(`${baseURL}/tree`, data);
};
