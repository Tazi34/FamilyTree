import { createAsyncThunk, createReducer } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { initialStatus } from "../../blog/redux/postsReducer";
import searchAPI from "../API/searchAPI";
import {
  SearchQueryUsersRequestData,
  SearchQueryUsersResponse,
} from "../API/searchQueryUsers";
import { StatusState } from "../../../helpers/helpers";
import { SearchUserDTO } from "../API/searchQueryUsers";

const searchUsersActionsPrefix = "search/users";

export type SearchUsersState = {
  status: StatusState;
  result: SearchUserDTO[];
};

export const searchUsers = createAsyncThunk<
  AxiosResponse<SearchQueryUsersResponse>,
  SearchQueryUsersRequestData
>(
  `${searchUsersActionsPrefix}/queryUsers`,
  async (data: SearchQueryUsersRequestData) => {
    return searchAPI.requestSearchQueryUsers(data);
  }
);
export const initialSearchUsersState: SearchUsersState = {
  status: initialStatus,
  result: [],
};
export const searchUsersReducer = createReducer<SearchUsersState>(
  initialSearchUsersState,
  (builder) => {
    builder
      .addCase(searchUsers.pending, (state, action) => {
        state.result = [];
        state.status.error = null;
        state.status.loading = true;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.result = action.payload.data.users;
        state.status.error = null;
        state.status.loading = false;
      })
      .addCase(searchUsers.rejected, (state, action: any) => {
        state.result = [];
        state.status.error = action.payload.error;
        state.status.loading = false;
      });
  }
);
