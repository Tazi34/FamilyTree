import {
  createAsyncThunk,
  createEntityAdapter,
  createReducer,
  EntityState,
} from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { ApplicationState } from "../../../helpers";
import {
  addThunkWithStatusHandlers,
  StatusState,
} from "../../../helpers/helpers";
import { Post } from "../../../model/Post";
import { postsAPI } from "./../postsAPI";
import { createStatusActions, Status } from "./genericStatusReducer";
const BLOG_API_URL = "posts/data";

const postsAdapter = createEntityAdapter<Post>();

//ACTIONS
export const addPost = createAsyncThunk<any, Post>(
  `${BLOG_API_URL}/postAdded`,
  async (post: Post): Promise<AxiosResponse> => {
    return postsAPI.addPost(post);
  }
);
export const deletePost = createAsyncThunk<any, number>(
  `${BLOG_API_URL}/postDeleted`,
  async (postId: number): Promise<AxiosResponse> => {
    return postsAPI.deletePost(postId);
  }
);
export const getPostsByBlogId = createAsyncThunk(
  `${BLOG_API_URL}/fetchByBlogId`,
  async (blogId: number): Promise<any> => {
    return postsAPI.getByBlogId(blogId);
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

//REDUCER

export const postsReducer = createReducer(postsInitialState, (builder) => {
  addThunkWithStatusHandlers(
    builder,
    addPost,
    (state: PostsState, action: any) => {
      console.log(action);
      //TODO zmienic na action.payload.data jak bedzie backend
      var entity = JSON.parse(JSON.stringify(action.meta.arg));
      entity.id = action.payload.data.id;
      postsAdapter.addOne(state, entity);
    }
  );

  addThunkWithStatusHandlers(
    builder,
    getPostsByBlogId,
    (state: PostsState, action: any) => {
      const postsData = action.payload.data.posts;
      const posts: Post[] = postsData.map((p: any) => ({
        id: p.postId,
        publicationDate: p.creationTime,
        title: "Title",
      }));

      postsAdapter.addMany(state, posts);
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
