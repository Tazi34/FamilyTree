import {
  createAction,
  createAsyncThunk,
  createDraftSafeSelector,
  createEntityAdapter,
  createReducer,
  EntityState,
} from "@reduxjs/toolkit";
import Axios, { AxiosResponse } from "axios";
import { dispatch } from "d3";
import { ApplicationState } from "../../helpers";
import { baseURL, CHAT_API_URL } from "../../helpers/apiHelpers";
import { Friend } from "../../model/Friend";

export type Chat = {
  user: {
    id: number;
    name: string;
    surname: string;
    image: string;
  };
};

export type ChatsState = {
  latestChats: EntityState<Friend>;
  currentChats: Chat[];
  loadedLatestChats: boolean;
  openChatsLimit: number;
};

const prefix = "chat";

const latestChatsAdapter = createEntityAdapter<Friend>();

export const getLatestChats = createAsyncThunk<AxiosResponse<any>, number>(
  `${prefix}/usersLatestChatsAcquired`,
  async (userId) => {
    //TODO zmienic przy deployu backendu
    return await Axios.get(`${baseURL}/latestChats/${userId}`);
  }
);
export const openChat = (userId: number) => (dispatch: any, getState: any) => {
  const state: ApplicationState = getState();
  const openedChats = state.chats.currentChats;
  if (openedChats.find((chat) => chat.user.id == userId)) {
    return;
  }

  return dispatch(createChat(userId));
};
export const closeChat = createAction<number>(`${prefix}/chatClosed`);
export const createChat = createAsyncThunk<AxiosResponse<any>, number>(
  `${prefix}/chatOpened`,
  async (userId) => {
    return await Axios.get(`${CHAT_API_URL}/${userId}`);
  }
);

export const initialState: ChatsState = {
  latestChats: latestChatsAdapter.getInitialState(),
  currentChats: [],
  openChatsLimit: 2,
  loadedLatestChats: false,
};

export const chatReducer = createReducer<ChatsState>(
  initialState,
  (builder) => {
    builder
      .addCase(getLatestChats.fulfilled, (state, action) => {
        //TODO finalnie nie bedzie .data.
        const chats: Friend[] = action.payload.data.users;

        state.loadedLatestChats = true;
        latestChatsAdapter.setAll(state.latestChats, chats);
      })
      .addCase(createChat.fulfilled, (state, action) => {
        const friend = action.payload.data;
        const id = friend.id;
        const newChat: Chat = {
          user: friend,
        };

        var chats = state.currentChats.filter((a) => a.user.id != id);

        if (chats.length >= state.openChatsLimit) {
          chats = chats.slice(0, state.openChatsLimit - 1);
        }
        chats.push(newChat);
        state.currentChats = chats;
      })
      .addCase(closeChat, (state, action) => {
        state.currentChats = state.currentChats.filter(
          (a) => a.user.id != action.payload
        );
      });
  }
);
//SELECTORS
export const selectChatsState = (state: ApplicationState) => state.chats;
export const latestsChatsSelector = latestChatsAdapter.getSelectors<ApplicationState>(
  (state) => state.chats.latestChats
);

export const currentChatsSelector = createDraftSafeSelector(
  selectChatsState,
  (state) => state.currentChats
);
export const finishedChatsLoading = createDraftSafeSelector(
  selectChatsState,
  (state) => state.loadedLatestChats
);
