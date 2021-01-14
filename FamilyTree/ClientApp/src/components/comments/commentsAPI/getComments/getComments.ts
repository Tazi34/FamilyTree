import { COMMENTS_API_URL } from "./../../../../helpers/apiHelpers";
import axios from "axios";
import { Comment } from "../../../../model/Comment";

export const GET_COMMENTS_API_URL = "";
export type GetCommentRequestData = { postId: number };

export type GetCommentResponse = {
  postId: number;
  comments: Comment[];
};

export const requestGetComments = (data: GetCommentRequestData) => {
  return axios.get<GetCommentResponse>(`${COMMENTS_API_URL}/${data.postId}`);
};
