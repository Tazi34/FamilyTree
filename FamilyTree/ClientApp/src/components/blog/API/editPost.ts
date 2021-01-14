import { Post } from "./../../../model/Post";
import axios from "axios";
import { BLOG_API_URL } from "../../../helpers/apiHelpers";
export type EditPostRequestData = {
  postId: number;
  title: string;
  text: string;
  pictureUrl: string;
};

export type EditPostResponse = Post;

export const requestEditPost = (data: EditPostRequestData) => {
  return axios.put<EditPostResponse>(`${BLOG_API_URL}`, data);
};
