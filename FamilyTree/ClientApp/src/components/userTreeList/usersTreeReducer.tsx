import {
  createAsyncThunk,
  createDraftSafeSelector,
  createEntityAdapter,
  createReducer,
  EntityState,
} from "@reduxjs/toolkit";
import Axios from "axios";
import { ApplicationState } from "../../helpers";
import { baseURL } from "../../helpers/apiHelpers";
import { addThunkWithStatusHandlers, StatusState } from "../../helpers/helpers";
import { TreeInformation } from "../../model/TreeInformation";
import { initialStatus } from "../blog/redux/postsReducer";

const treesReducerPath = "trees";

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
    return Axios.get(`${baseURL}/tree/user/${userId}`);
  }
);
export const changeTreeVisibility = createAsyncThunk(
  `userTrees/changeVisibility`,
  (treeInformation: TreeInformation) => async () => {
    const modifiedTreeData: TreeInformation = {
      ...treeInformation,
      isPrivate: !treeInformation.isPrivate,
    };
    return Axios.put(`${baseURL}/tree/`, modifiedTreeData);
  }
);

type ChangeTreeNameRequest = {
  treeInformation: TreeInformation;
  newName: string;
};

export const changeTreeName = createAsyncThunk(
  `userTrees/changeTreeName`,
  (requestData: ChangeTreeNameRequest) => async () => {
    const modifiedTreeData: TreeInformation = {
      ...requestData.treeInformation,
      name: requestData.newName,
    };
    return Axios.put(`${baseURL}/tree/`, modifiedTreeData);
  }
);
export const userTreesReducer = createReducer<UserTreesState>(
  initialUserTreesState,
  (builder) => {
    addThunkWithStatusHandlers<any, any, UserTreesState>(
      builder,
      getUserTrees,
      (state, action) => {
        console.log(action);
        const userTrees = action.payload.data.trees;
        console.log(state);
        userTreesAdapter.setAll(state.trees, userTrees);
      }
    );
    builder.addCase(changeTreeVisibility.fulfilled, (state, action) => {
      const treeInformation = action.meta.arg;
      userTreesAdapter.removeOne(state.trees, treeInformation.treeId);
      userTreesAdapter.addOne(state.trees, {
        ...treeInformation,
        isPrivate: !treeInformation.isPrivate,
      });
    });
    builder.addCase(changeTreeName.fulfilled, (state, action) => {
      const treeInformation = action.meta.arg.treeInformation;
      const newName = action.meta.arg.newName;
      userTreesAdapter.removeOne(state.trees, treeInformation.treeId);
      userTreesAdapter.addOne(state.trees, {
        ...treeInformation,
        name: newName,
      });
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
