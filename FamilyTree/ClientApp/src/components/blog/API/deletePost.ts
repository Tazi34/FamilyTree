import axios from "axios";
import { BLOG_API_URL } from "../../../helpers/apiHelpers";
export type DeletePostRequestData = {
  postId: number;
};

export type DeletePostResponse = void;

export const requestDeletePost = (data: DeletePostRequestData) => {
  return axios.delete<DeletePostResponse>(`${BLOG_API_URL}/${data.postId}`);
};
