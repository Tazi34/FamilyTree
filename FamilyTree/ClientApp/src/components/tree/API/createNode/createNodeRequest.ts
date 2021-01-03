import { TreeAPI, TreeNodeAPI } from "./../utils/TreeModel";
import axios from "axios";
import { baseURL, TREE_API_URL } from "../../../../helpers/apiHelpers";
import { Sex } from "../../../../model/Sex";

export const CREATE_NODE_API_URL = `${TREE_API_URL}/node`;

export type CreateNodeRequestData = {
  userId: number;
  treeId: number;
  birthday: string;
  description: string;
  name: string;
  surname: string;
  pictureUrl: string;
  fatherId: number;
  motherId: number;
  sex: Sex;
  children: number[];
  partners: number[];
  x: number;
  y: number;
};

export type CreateNodeResponse = TreeNodeAPI;

export const createTreeNode = (data: CreateNodeRequestData) => {
  return axios.post<CreateNodeResponse>(CREATE_NODE_API_URL, data);
};
