import { GetPostResponse } from "./../API/getPosts";
import {
  createAsyncThunk,
  createEntityAdapter,
  createReducer,
  createSelector,
  EntityState,
} from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { ApplicationState } from "../../../helpers";
import {
  addThunkWithStatusHandlers,
  StatusState,
} from "../../../helpers/helpers";
import { Post } from "../../../model/Post";
import { CreatePostRequestData, CreatePostResponse } from "../API/createPost";
import { postsAPI } from "../API/postsAPI";
import { createStatusActions, Status } from "./genericStatusReducer";
import { EditPostRequestData, EditPostResponse } from "../API/editPost";
const BLOG_API_URL = "posts/data";

const postsAdapter = createEntityAdapter<Post>({
  selectId: (post) => post.postId,
});

//ACTIONS
export const createPost = createAsyncThunk<
  AxiosResponse<CreatePostResponse>,
  CreatePostRequestData
>(`${BLOG_API_URL}/postAdded`, async (data) => {
  return await postsAPI.requestCreatePost(data);
});

export const editPost = createAsyncThunk<
  AxiosResponse<EditPostResponse>,
  EditPostRequestData
>(`${BLOG_API_URL}/postEdited`, async (data) => {
  return await postsAPI.requestEditPost(data);
});
export const deletePost = createAsyncThunk<any, number>(
  `${BLOG_API_URL}/postDeleted`,
  async (postId: number): Promise<AxiosResponse> => {
    return postsAPI.requestDeletePost({ postId });
  }
);
export const getPostsByBlogId = createAsyncThunk(
  `${BLOG_API_URL}/fetchByBlogId`,
  async (blogId: number): Promise<any> => {
    return postsAPI.requestGetPosts({ userId: blogId });
  }
);

//SELECTORS

export const postsSelectors = postsAdapter.getSelectors<ApplicationState>(
  (state) => state.posts
);

//STATE
export const initialStatus: Status = {
  error: null,
  loading: false,
};

export type PostsState = EntityState<Post> & {
  status: StatusState;
};

export const postsInitialState = postsAdapter.getInitialState({
  status: initialStatus,
}) as PostsState;

export const postByIdSelector = (id: number) => {
  return createSelector(
    (state: ApplicationState) => state,
    (state) => postsSelectors.selectById(state, id)
  );
};
//REDUCER

export const postsReducer = createReducer(postsInitialState, (builder) => {
  addThunkWithStatusHandlers(
    builder,
    createPost,
    (state: PostsState, action: any) => {
      const data: CreatePostResponse = action.payload.data;
      postsAdapter.addOne(state, data);
    }
  );

  addThunkWithStatusHandlers(
    builder,
    getPostsByBlogId,
    (state: PostsState, action: any) => {
      const data: GetPostResponse = action.payload.data;

      postsAdapter.addMany(state, data.posts.reverse());
    },
    (state: PostsState, action: any) => {
      postsAdapter.removeAll(state);
    }
  );
  addThunkWithStatusHandlers(
    builder,
    deletePost,
    (state: PostsState, action: any) => {
      postsAdapter.removeOne(state, action.meta.arg);
    }
  );
});

const statusReducerCreator = createStatusActions("posts");
