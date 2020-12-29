import { createAsyncThunk, createReducer } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { initialStatus } from "../../blog/redux/postsReducer";
import searchAPI from "../API/searchAPI";
import {
  SearchQueryTreesRequestData,
  SearchQueryTreesResponse,
} from "../API/searchQueryTrees";
import { StatusState } from "./../../../helpers/helpers";
import { SearchTreeDTO } from "./../API/searchQueryTrees";

const searchTreesActionsPrefix = "search/trees";

export type SearchTreesState = {
  status: StatusState;
  result: SearchTreeDTO[];
};

export const searchTrees = createAsyncThunk<
  AxiosResponse<SearchQueryTreesResponse>,
  SearchQueryTreesRequestData
>(
  `${searchTreesActionsPrefix}/queryTrees`,
  async (data: SearchQueryTreesRequestData) => {
    return searchAPI.requestSearchQueryTrees(data);
  }
);
export const initialSearchTreesState = {
  status: initialStatus,
  result: [],
};
export const searchTreesReducer = createReducer<SearchTreesState>(
  initialSearchTreesState,
  (builder) => {
    builder
      .addCase(searchTrees.pending, (state, action) => {
        state.result = [];
        state.status.error = null;
        state.status.loading = true;
      })
      .addCase(searchTrees.fulfilled, (state, action) => {
        state.result = action.payload.data.trees;
        state.status.error = null;
        state.status.loading = false;
      })
      .addCase(searchTrees.rejected, (state, action: any) => {
        state.result = [];
        state.status.error = action.payload.error;
        state.status.loading = false;
      });
  }
);
