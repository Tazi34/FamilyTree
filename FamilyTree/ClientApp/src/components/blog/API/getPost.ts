import axios from "axios";
import { BLOG_API_URL } from "../../../helpers/apiHelpers";
import { Post } from "../../../model/Post";
export type GetPostRequestData = {
  postId: number;
};

export type GetPostResponse = Post;

export const requestGetPost = (data: GetPostRequestData) => {
  return axios.get<GetPostResponse>(`${BLOG_API_URL}/post/${data.postId}`);
};
