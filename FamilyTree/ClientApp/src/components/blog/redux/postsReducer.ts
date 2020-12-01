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
const postsDataPath = "posts/data";

const postsAdapter = createEntityAdapter<Post>();

//ACTIONS
export const addPost = createAsyncThunk<any, Post>(
  `${postsDataPath}/postAdded`,
  async (post: Post): Promise<AxiosResponse> => {
    return postsAPI.addPost(post);
  }
);
export const deletePost = createAsyncThunk<any, number>(
  `${postsDataPath}/postDeleted`,
  async (postId: number): Promise<AxiosResponse> => {
    return postsAPI.deletePost(postId);
  }
);
export const getPostsByBlogId = createAsyncThunk(
  `${postsDataPath}/fetchByBlogId`,
  async (blogId: number): Promise<any> => {
    return postsAPI.getByBlogId(blogId);
  }
);

export const getPosts = createAsyncThunk(
  `${postsDataPath}/fetchAll`,
  async (): Promise<any> => {
    return postsAPI.getPosts();
  }
);

//SELECTORS

export const postsSelectors = postsAdapter.getSelectors<ApplicationState>(
  (state) => state.posts
);

//STATE
const initialStatus: Status = {
  error: null,
  loading: false,
};

export type PostsState = EntityState<Post> & StatusState;

const postsInitialState = postsAdapter.getInitialState({
  status: initialStatus,
});

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
      console.log(entity);
      postsAdapter.addOne(state, entity);
    }
  );

  addThunkWithStatusHandlers(
    builder,
    getPosts,
    (state: PostsState, action: any) => {
      postsAdapter.addMany(state, action.payload.data);
    }
  );
  addThunkWithStatusHandlers(
    builder,
    deletePost,
    (state: PostsState, action: any) => {
      console.log(action);
      postsAdapter.removeOne(state, action.meta.arg);
    }
  );
});

const statusReducerCreator = createStatusActions("posts");
