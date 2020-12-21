import { requestCreatePost } from "./createPost";
import { requestDeletePost } from "./deletePost";
import { requestEditPost } from "./editPost";
import { requestGetPosts } from "./getPosts";

export const postsAPI = {
  requestGetPosts,
  requestDeletePost,
  requestCreatePost,
  requestEditPost,
};
