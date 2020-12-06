import { chatReducer } from "./../components/chat/chatReducer";
import { authenticationReducer } from "./../components/loginPage/authenticationReducer";
import {
  connectionReducer,
  ConnectionState,
} from "./../components/tree/neww/connectionReducer";
import { combineReducers } from "redux";
import {
  treeReducer,
  TreeState,
} from "../components/tree/neww/model/treeReducer";
import {
  postsReducer,
  PostsState,
} from "./../components/blog/redux/postsReducer";
import { AuthenticationState } from "../components/loginPage/authenticationReducer";
import { ChatsState } from "../components/chat/chatReducer";

// The top-level state object
export interface ApplicationState {
  posts: PostsState;
  tree: TreeState;
  connection: ConnectionState;
  authentication: AuthenticationState;
  chats: ChatsState;
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
  posts: postsReducer,
  tree: treeReducer,
  connection: connectionReducer,
  authentication: authenticationReducer,
  chats: chatReducer,
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
  (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
