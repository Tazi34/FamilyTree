import { selectSelf } from "./../../loginPage/authenticationReducer";
import { SearchUserDTO } from "./../API/searchQueryUsers";
import { SearchTreeDTO } from "./../API/searchQueryTrees";
import { searchUsersReducer } from "./searchUsersReducer";
import { searchTreesReducer } from "./searchTreesReducer";
import { combineReducers } from "redux";
import { createSelector } from "@reduxjs/toolkit";
import { ApplicationState } from "../../../helpers";

export const searchReducer = combineReducers({
  trees: searchTreesReducer,
  users: searchUsersReducer,
});

export type SearchResultsDTO = {
  trees: SearchTreeDTO[];
  users: SearchUserDTO[];
};

export const searchResultSelector = createSelector<
  ApplicationState,
  any,
  SearchResultsDTO
>(selectSelf, (state) => ({
  trees: state.search.trees.result,
  users: state.search.users.result,
}));
