import { requestGetPosts } from "./getPosts";
import { requestCreatePost } from "./createPost";
import { Post } from "../../../model/Post";
import Axios, { AxiosResponse } from "axios";
import { baseURL, BLOG_API_URL } from "../../../helpers/apiHelpers";

const deletePost = async (id: number): Promise<AxiosResponse> => {
  return Axios.delete<Post>(`${BLOG_API_URL}/${id}`);
};

export const postsAPI = {
  requestGetPosts,
  deletePost,
  requestCreatePost,
};
