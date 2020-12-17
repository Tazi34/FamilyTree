import {
  UserTreesState,
  initialUserTreesState,
  userTreesReducer,
} from "./../components/userTreeList/usersTreeReducer";
import { treeInitialState } from "../components/tree/reducer/treeReducer";
import {
  chatInitialState,
  chatReducer,
} from "./../components/chat/chatReducer";
import {
  authenticationInitialState,
  authenticationReducer,
} from "./../components/loginPage/authenticationReducer";

import { combineReducers } from "redux";
import { treeReducer, TreeState } from "../components/tree/reducer/treeReducer";
import {
  postsInitialState,
  postsReducer,
  PostsState,
} from "./../components/blog/redux/postsReducer";
import { AuthenticationState } from "../components/loginPage/authenticationReducer";
import { ChatsState } from "../components/chat/chatReducer";
import {
  connectionReducer,
  ConnectionState,
  connectionsInitialState,
} from "../components/tree/connectionReducer";

// The top-level state object
export interface ApplicationState {
  posts: PostsState;
  tree: TreeState;
  connection: ConnectionState;
  authentication: AuthenticationState;
  chats: ChatsState;
  userTrees: UserTreesState;
}
export const initialAppState: ApplicationState = {
  authentication: authenticationInitialState,
  chats: chatInitialState,
  connection: connectionsInitialState,
  posts: postsInitialState,
  tree: treeInitialState,
  userTrees: initialUserTreesState,
};

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
  posts: postsReducer,
  tree: treeReducer,
  connection: connectionReducer,
  authentication: authenticationReducer,
  chats: chatReducer,
  userTrees: userTreesReducer,
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
  (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
