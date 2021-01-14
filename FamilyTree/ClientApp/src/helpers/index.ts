import {
  alertsReducer,
  AlertsState,
  initialAlertsState,
} from "../components/alerts/reducer/alertsReducer";
import {
  canvasReducer,
  CanvasState,
  initialCanvasState,
} from "../components/canvas/reducer/canvasReducer";
import { ChatsState } from "../components/chat/chatReducer";
import { invitationsReducer } from "../components/invitation/reducer/invitationsReducer";
import { AuthenticationState } from "../components/loginPage/authenticationReducer";
import {
  searchReducer,
  SearchState,
} from "../components/search/redux/searchReducer";
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
  invitationInitialState,
  InvitationsState,
} from "./../components/invitation/reducer/invitationsReducer";
import {
  authenticationInitialState,
  authenticationReducer,
} from "./../components/loginPage/authenticationReducer";
import { initialSearchState } from "./../components/search/redux/searchReducer";
import {
  initialUserTreesState,
  userTreesReducer,
  UserTreesState,
} from "./../components/userTreeList/usersTreeReducer";

// The top-level state object
export interface ApplicationState {
  posts: PostsState;
  tree: TreeState;
  authentication: AuthenticationState;
  chats: ChatsState;
  userTrees: UserTreesState;
  search: SearchState;
  invitations: InvitationsState;
  alerts: AlertsState;
  canvas: CanvasState;
}
export const initialAppState: ApplicationState = {
  authentication: authenticationInitialState,
  chats: chatInitialState,
  posts: postsInitialState,
  tree: treeInitialState,
  userTrees: initialUserTreesState,
  search: initialSearchState,
  invitations: invitationInitialState,
  alerts: initialAlertsState,
  canvas: initialCanvasState,
};

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.

export const reducersToPersis: any = { authentication: authenticationReducer };

export const reducers: any = {
  invitations: invitationsReducer,
  posts: postsReducer,
  tree: treeReducer,
  chats: chatReducer,
  userTrees: userTreesReducer,
  search: searchReducer,
  alerts: alertsReducer,
  canvas: canvasReducer,
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
  (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
