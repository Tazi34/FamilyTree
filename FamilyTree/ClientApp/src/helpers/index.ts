import { initialSearchState } from "./../components/search/redux/searchReducer";
import { ChatsState } from "../components/chat/chatReducer";
import { AuthenticationState } from "../components/loginPage/authenticationReducer";
import {
  searchReducer,
  SearchState,
} from "../components/search/redux/searchReducer";
import {
  connectionReducer,
  connectionsInitialState,
  ConnectionState,
} from "../components/tree/connectionReducer";
import {
  treeInitialState,
  treeReducer,
  TreeState,
} from "../components/tree/reducer/treeReducer";
import {
  postsInitialState,
  postsReducer,
  PostsState,
} from "./../components/blog/redux/postsReducer";
import {
  chatInitialState,
  chatReducer,
} from "./../components/chat/chatReducer";
import {
  authenticationInitialState,
  authenticationReducer,
} from "./../components/loginPage/authenticationReducer";
import {
  initialUserTreesState,
  userTreesReducer,
  UserTreesState,
} from "./../components/userTreeList/usersTreeReducer";

// The top-level state object
export interface ApplicationState {
  posts: PostsState;
  tree: TreeState;
  connection: ConnectionState;
  authentication: AuthenticationState;
  chats: ChatsState;
  userTrees: UserTreesState;
  search: SearchState;
}
export const initialAppState: ApplicationState = {
  authentication: authenticationInitialState,
  chats: chatInitialState,
  connection: connectionsInitialState,
  posts: postsInitialState,
  tree: treeInitialState,
  userTrees: initialUserTreesState,
  search: initialSearchState,
};

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.

export const reducersToPersis: any = { authentication: authenticationReducer };

export const reducers: any = {
  posts: postsReducer,
  tree: treeReducer,
  connection: connectionReducer,
  chats: chatReducer,
  userTrees: userTreesReducer,
  search: searchReducer,
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
  (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
