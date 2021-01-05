import {
  createAsyncThunk,
  createDraftSafeSelector,
  createEntityAdapter,
  createReducer,
  EntityState,
} from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";
import { ApplicationState } from "../../helpers";
import { baseURL } from "../../helpers/apiHelpers";
import { addThunkWithStatusHandlers, StatusState } from "../../helpers/helpers";
import { TreeInformation } from "../../model/TreeInformation";
import { initialStatus } from "../blog/redux/postsReducer";
import { treeAPI } from "../tree/API/treeAPI";
import { TreeAPI } from "../tree/API/utils/TreeModel";

const treesReducerPath = "userTrees";

export type UserTreesState = {
  trees: EntityState<TreeInformation>;
  status: StatusState;
  currentTree: TreeInformation | null;
};
export const userTreesAdapter = createEntityAdapter<TreeInformation>({
  selectId: (tree) => tree.treeId,
});
export const initialUserTreesState: UserTreesState = {
  trees: userTreesAdapter.getInitialState(),
  status: initialStatus,
  currentTree: null,
};
const usersTreesSelectorsLocal = userTreesAdapter.getSelectors<ApplicationState>(
  (state) => state.userTrees.trees
);
export const usersTreesSelectors = userTreesAdapter.getSelectors<ApplicationState>(
  (state) => state.userTrees.trees
);
export const getUserTrees = createAsyncThunk(
  `userTrees/getUserTrees`,
  async (userId: number) => {
    return axios.get(`${baseURL}/tree/user/${userId}`);
  }
);

export const createTree = createAsyncThunk<AxiosResponse<TreeAPI>, string>(
  `userTrees/createTree`,
  async (treeName: string) => {
    const treeData = {
      treeName,
      isPrivate: true,
    };
    return axios.post<TreeAPI>(`${baseURL}/tree/`, treeData);
  }
);

export const userTreesReducer = createReducer<UserTreesState>(
  initialUserTreesState,
  (builder) => {
    addThunkWithStatusHandlers<any, any, UserTreesState>(
      builder,
      getUserTrees,
      (state, action) => {
        const userTrees = action.payload.data.trees;
        userTreesAdapter.setAll(state.trees, userTrees);
      }
    );
    builder.addCase(createTree.fulfilled, (state, action) => {
      const tree = action.payload.data;
      const treeInformation: TreeInformation = {
        canEdit: tree.canEdit,
        isPrivate: tree.isPrivate,
        treeId: tree.treeId,
        name: tree.name,
      };
      userTreesAdapter.addOne(state.trees, treeInformation);
    });
  }
);

export const userTreesStateSelector = createDraftSafeSelector<
  ApplicationState,
  ApplicationState,
  UserTreesState
>(
  (state) => state,
  (state) => {
    return state.userTrees;
  }
);
