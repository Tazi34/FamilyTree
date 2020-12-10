import { Post } from "./../../model/Post";
import Axios, { AxiosResponse } from "axios";
import { baseURL, BLOG_API_URL } from "./../../helpers/apiHelpers";

const getByBlogId = async (blogId: number): Promise<AxiosResponse<Post>> => {
  return Axios.get<Post>(`${BLOG_API_URL}/${blogId}`);
};

const deletePost = async (id: number): Promise<AxiosResponse> => {
  return Axios.delete<Post>(`${BLOG_API_URL}/${id}`);
};
const addPost = async (post: Post): Promise<AxiosResponse> => {
  return Axios.post<Post>(`${BLOG_API_URL}/`);
};
export const postsAPI = {
  getByBlogId,
  deletePost,
  addPost,
};
