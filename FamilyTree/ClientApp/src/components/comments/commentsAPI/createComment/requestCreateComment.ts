import { COMMENTS_API_URL } from "./../../../../helpers/apiHelpers";
import axios from "axios";
import { Comment } from "../../../../model/Comment";

export const CREATE_COMMENT_API_URL = COMMENTS_API_URL;
export type CreateCommentRequestData = {
  postId: number;
  text: string;
};

export type CreateCommentResponse = {
  postId: number;
  comments: Comment[];
};

export const requestCreateComment = (data: CreateCommentRequestData) => {
  return axios.post<CreateCommentResponse>(`${CREATE_COMMENT_API_URL}`, data);
};
