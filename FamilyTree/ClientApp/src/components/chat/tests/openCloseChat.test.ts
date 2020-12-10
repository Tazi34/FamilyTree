import { AnyAction } from "redux";
import configureMockStore from "redux-mock-store";
import thunk, { ThunkDispatch } from "redux-thunk";
import { ApplicationState, initialAppState } from "../../../helpers";
import {
  closeChat,
  createChat,
  currentChatsSelector,
  openChat,
} from "../chatReducer";
import { chatReducer, currentChatsSelectorLocal } from "./../chatReducer";
type DispatchExts = ThunkDispatch<ApplicationState, void, AnyAction>;
const mockUser = (id: number) => ({
  user: {
    id: id,
    image: "",
    messages: [],
    name: "",
    surname: "",
  },
});

const setupState = () => {
  const state = initialAppState;
  state.chats.currentChats = [mockUser(1)];
  return state;
};

const middlewares = [thunk];

describe("delete-node", () => {
  var mockStore = configureMockStore<ApplicationState, DispatchExts>(
    middlewares
  );
  var store = mockStore();
  var state: ApplicationState;

  beforeEach(() => {
    state = setupState();
    store = mockStore(state);
  });

  it("given already opened chat should close it", () => {
    store.dispatch(openChat(1));

    var actions = store.getActions();

    expect(actions[0].type).toBe(closeChat.type);
  });
  it("given not already opened chat should open it", () => {
    store.dispatch(openChat(2));

    var actions = store.getActions();

    expect(actions[0].type).toBe(createChat.pending.type);
  });
});
