import {
  createAsyncThunk,
  createReducer,
  createSelector,
} from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { ApplicationState } from "../../../helpers";
import { StatusState } from "../../../helpers/helpers";
import { initialStatus } from "../../blog/redux/postsReducer";
import { selectSelf } from "../../loginPage/authenticationReducer";
import searchAPI from "../API/searchAPI";
import {
  SearchQueryRequestData,
  SearchQueryResponse,
  SearchTreeDTO,
  SearchUserDTO,
} from "../API/searchQuery";

const searchTreesActionsPrefix = "search/trees";

export type SearchState = {
  status: StatusState;
  result: SearchResultsDTO;
};

export type SearchResultsDTO = {
  trees: SearchTreeDTO[];
  users: SearchUserDTO[];
};

export const search = createAsyncThunk<
  AxiosResponse<SearchQueryResponse>,
  SearchQueryRequestData
>(
  `${searchTreesActionsPrefix}/searchQuery`,
  async (data: SearchQueryRequestData) => {
    return searchAPI.requestSearchQuery(data);
  }
);
export const initialSearchState = {
  status: initialStatus,
  result: {
    trees: [],
    users: [],
  },
};
export const searchReducer = createReducer<SearchState>(
  initialSearchState,
  (builder) => {
    builder
      .addCase(search.pending, (state, action) => {
        state.result.trees = [];
        state.result.users = [];
        state.status.error = null;
        state.status.loading = true;
      })
      .addCase(search.fulfilled, (state, action) => {
        state.result = action.payload.data;
        state.status.error = null;
        state.status.loading = false;
      })
      .addCase(search.rejected, (state, action: any) => {
        state.result.trees = [];
        state.result.users = [];
        state.status.error = action.payload.error;
        state.status.loading = false;
      });
  }
);

export const searchResultSelector = createSelector<
  ApplicationState,
  any,
  SearchResultsDTO
>(selectSelf, (state: ApplicationState) => ({
  trees: state.search.result.trees,
  users: state.search.result.users,
}));
