import { Post } from "./../../../model/Post";
import axios from "axios";
import { BLOG_API_URL } from "../../../helpers/apiHelpers";
export type CreatePostRequestData = {
  title: string;
  text: string;
  pictureUrl: string;
};

export type CreatePostResponse = Post;

export const requestCreatePost = (data: CreatePostRequestData) => {
  return axios.post<CreatePostResponse>(BLOG_API_URL, data);
};
