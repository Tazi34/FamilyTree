import { Post } from "./../../model/Post";
import Axios, { AxiosResponse } from "axios";
import { baseURL } from "./../../helpers/apiHelpers";

export const postsURL = `${baseURL}/posts`;
const getByBlogId = async (blogId: number): Promise<AxiosResponse<Post>> => {
  return Axios.get<Post>(`${postsURL}/${blogId}`);
};
const getPosts = async (): Promise<AxiosResponse<Post>> => {
  return Axios.get<Post>(`${postsURL}`);
};

const deletePost = async (id: number): Promise<AxiosResponse> => {
  return Axios.delete<Post>(`${postsURL}/${id}`);
};
const addPost = async (post: Post): Promise<AxiosResponse> => {
  return Axios.post<Post>(`${postsURL}/`);
};
export const postsAPI = {
  getPosts,
  getByBlogId,
  deletePost,
  addPost,
};
