import { Post } from "./../../../model/Post";
import axios from "axios";
import { BLOG_API_URL } from "../../../helpers/apiHelpers";
export type GetPostsRequestData = {
  userId: number;
};

export type GetPostsResponse = {
  posts: Post[];
};

export const requestGetPosts = (data: GetPostsRequestData) => {
  return axios.get<GetPostsResponse>(`${BLOG_API_URL}/${data.userId}`);
};
