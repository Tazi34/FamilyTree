import axios from "axios";
import { TREE_API_URL } from "../../../../helpers/apiHelpers";

export const UPLOAD_NODE_IMAGE_API_URL = `${TREE_API_URL}/picture`;

export type UploadNodePictureRequestData = {
  picture: any;
  nodeId: number;
};

export type UploadNodePictureResponse = {
  pictureUrl: string;
};

export const uploadTreeNodePicture = (data: UploadNodePictureRequestData) => {
  const form = new FormData();
  form.append("picture", data.picture);
  form.set("nodeId", data.nodeId.toString());
  return axios.post<UploadNodePictureResponse>(UPLOAD_NODE_IMAGE_API_URL, form);
};
