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
  picture: any | null;
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
  var form = new FormData();
  form.append("picture", data.picture);
  var dataWithoutPicture = Object.assign({}, data) as any;
  delete dataWithoutPicture.picture;
  form.append("jsonBody", JSON.stringify(dataWithoutPicture));
  return axios.post<CreateNodeResponse>(CREATE_NODE_API_URL, form);
};
