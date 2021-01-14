import {
  createAsyncThunk,
  createDraftSafeSelector,
  createEntityAdapter,
  createReducer,
  createSelector,
  EntityState,
} from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { ApplicationState } from "../../../helpers";
import {
  addThunkWithStatusHandlers,
  createActionWithPayload,
  StatusState,
} from "../../../helpers/helpers";
import { Comment } from "../../../model/Comment";
import { Post } from "../../../model/Post";
import { EditProfileResponse } from "../../userProfile/API/editProfile";
import { CreatePostRequestData, CreatePostResponse } from "../API/createPost";
import { EditPostRequestData, EditPostResponse } from "../API/editPost";
import { GetBlogResponse } from "../API/getBlog";
import { GetPostRequestData, GetPostResponse } from "../API/getPost";
import { postsAPI } from "../API/postsAPI";
import { BlogProfile } from "./../../../model/BlogProfile";
import {
  createComment,
  deleteComment,
  editComment,
  getComments,
} from "./comments/commentsActions";
import { Status } from "./genericStatusReducer";
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
export const getBlog = createAsyncThunk(
  `${BLOG_API_URL}/fetchByBlogId`,
  async (blogId: number) => {
    return postsAPI.requestGetBlog({ userId: blogId });
  }
);

export const editProfileBlog = createActionWithPayload<EditProfileResponse>(
  `${BLOG_API_URL}/editProfile`
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
  profile: BlogProfile | null;
  comments: Comment[];
  currentPost: Post | null;
};

export const postsInitialState = postsAdapter.getInitialState({
  status: initialStatus,
  profile: null,
  comments: [],
  currentPost: null,
}) as PostsState;

export const postByIdSelector = (id: number) => {
  return createSelector(
    (state: ApplicationState) => state,
    (state) => postsSelectors.selectById(state, id)
  );
};
export const selectCurrentPost = createDraftSafeSelector(
  (state: ApplicationState) => state,
  (state) => state.posts.currentPost
);
//REDUCER
export const fetchPost = createAsyncThunk<
  AxiosResponse<GetPostResponse>,
  GetPostRequestData
>("/posts/getPost", async (data) => {
  return postsAPI.requestGetPost(data);
});
export const postsReducer = createReducer(postsInitialState, (builder) => {
  builder.addCase(editProfileBlog, (state, action) => {
    state.profile = {
      pictureUrl: state.profile?.pictureUrl ?? "",
      ...action.payload,
    };
  });
  addThunkWithStatusHandlers(
    builder,
    fetchPost,
    (state: PostsState, action: any) => {
      state.currentPost = action.payload.data;
    },
    (state: PostsState, action: any) => {},

    (state: PostsState, action: any) => {
      state.currentPost = null;
    }
  );
  addThunkWithStatusHandlers(
    builder,
    getComments,
    (state: PostsState, action: any) => {
      state.comments = action.payload.data.comments;
    },
    (state: PostsState, action: any) => {},

    (state: PostsState, action: any) => {
      state.comments = [];
    }
  );
  addThunkWithStatusHandlers(
    builder,
    createComment,
    (state: PostsState, action: any) => {
      state.comments = action.payload.data.comments;
    }
  );
  addThunkWithStatusHandlers(
    builder,
    deleteComment,
    (state: PostsState, action: any) => {
      state.comments = action.payload.data.comments;
    }
  );
  addThunkWithStatusHandlers(
    builder,
    editComment,
    (state: PostsState, action: any) => {
      if (state.comments) {
        const comments = state.comments.filter(
          (c) => c.commentId !== action.payload.data.commentId
        );
        comments.push(action.payload.data);
        state.comments = comments;
      }
    }
  );

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
    getBlog,
    (state: PostsState, action: any) => {
      const data: GetBlogResponse = action.payload.data;

      state.profile = data.user;
      postsAdapter.addMany(state, data.posts.reverse());
    },
    (state: PostsState, action: any) => {
      state.profile = null;
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

export const selectPostStatus = createDraftSafeSelector(
  (state: ApplicationState) => state,
  (state) => state.posts.status
);
export const selectComments = createDraftSafeSelector(
  (state: ApplicationState) => state,
  (state) => state.posts.comments
);
