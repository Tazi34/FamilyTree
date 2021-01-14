import axios from "axios";
import { Comment } from "../../../../model/Comment";

export const EDIT_COMMENT_API_URL = "";
export type EditCommentRequestData = Comment;

export type EditCommentResponse = Comment;

export const requestEditComment = (data: EditCommentRequestData) => {
  return axios.put<EditCommentResponse>(`${EDIT_COMMENT_API_URL}`, data);
};
