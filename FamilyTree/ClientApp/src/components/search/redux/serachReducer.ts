import { searchUsersReducer } from "./searchUsersReducer";
import { searchTreesReducer } from "./searchTreesReducer";
import { combineReducers } from "redux";

export const searchReducer = combineReducers({
  searchTreesReducer,
  searchUsersReducer,
});
