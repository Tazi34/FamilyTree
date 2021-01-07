import { COMMENTS_API_URL } from "./../../../../helpers/apiHelpers";
import axios from "axios";
import { Comment } from "../../../../model/Comment";
export const DELETE_COMMENT_API_URL = COMMENTS_API_URL;
export type DeleteCommentRequestData = {
  commentId: number;
};

export type DeleteCommentResponse = {
  postId: number;
  comments: Comment[];
};

export const requestDeleteComment = (data: DeleteCommentRequestData) => {
  return axios.delete<DeleteCommentResponse>(
    `${DELETE_COMMENT_API_URL}/${data.commentId}`
  );
};
