import { requestGetPost } from "./getPost";
import { requestCreatePost } from "./createPost";
import { requestDeletePost } from "./deletePost";
import { requestEditPost } from "./editPost";
import { requestGetBlog } from "./getBlog";

export const postsAPI = {
  requestGetBlog,
  requestDeletePost,
  requestCreatePost,
  requestEditPost,
  requestGetPost,
};
