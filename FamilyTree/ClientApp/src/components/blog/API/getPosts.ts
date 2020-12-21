import { Post } from "./../../../model/Post";
import axios from "axios";
import { BLOG_API_URL } from "../../../helpers/apiHelpers";
export type GetPostRequestData = {
  userId: number;
};

export type GetPostResponse = {
  posts: Post[];
};

export const requestGetPosts = (data: GetPostRequestData) => {
  return axios.get<GetPostResponse>(`${BLOG_API_URL}/${data.userId}`);
};
