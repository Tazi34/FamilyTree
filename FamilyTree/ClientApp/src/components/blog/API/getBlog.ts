import { BlogProfile } from "./../../../model/BlogProfile";
import { Post } from "../../../model/Post";
import axios from "axios";
import { BLOG_API_URL } from "../../../helpers/apiHelpers";
export type GetBlogRequestData = {
  userId: number;
};

export type GetBlogResponse = {
  user: BlogProfile;
  posts: Post[];
};

export const requestGetBlog = (data: GetBlogRequestData) => {
  return axios.get<GetBlogResponse>(`${BLOG_API_URL}/${data.userId}`);
};
