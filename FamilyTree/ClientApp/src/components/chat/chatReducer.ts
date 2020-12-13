import * as signalR from "@microsoft/signalr";
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
import { baseURL, CHAT_API_URL, localURL } from "../../helpers/apiHelpers";
import { Friend } from "../../model/Friend";

const connectionBuilder = new signalR.HubConnectionBuilder().withUrl(
  "https://familytree.azurewebsites.net/chatHub",
  {
    accessTokenFactory: () =>
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjEiLCJuYmYiOjE2MDc3MDk5MTAsImV4cCI6MTYwODMxNDcxMCwiaWF0IjoxNjA3NzA5OTEwfQ.J-8oxsOxnGpLWy3rZ2yRguc4FDR9w8pn4hCYB9moSwY",
  }
);
type ConnectionHub = any;

export type Message = {
  date: Date;
  outgoing: boolean;
  text: string;
  id: number;
};
export type Chat = {
  user: {
    id: number;
    name: string;
    surname: string;
    image: string;
    messages: Message[];
  };
};

export type ChatsState = {
  latestChats: EntityState<Friend>;
  currentChats: Chat[];
  loadedLatestChats: boolean;
  openChatsLimit: number;
  connectionHub: ConnectionHub | null;
};

const prefix = "chat";

const latestChatsAdapter = createEntityAdapter<Friend>();

export const getLatestChats = createAsyncThunk<AxiosResponse<any>, number>(
  `${prefix}/usersLatestChatsAcquired`,
  async (userId) => {
    //TODO zmienic przy deployu backendu
    return await Axios.get(`${localURL}/latestChats/${userId}`);
  }
);
export const openChat = createAsyncThunk(
  "openChat",
  async (userId: number) => async (dispatch: any, getState: any) => {
    const state: ApplicationState = getState();
    const openedChats = state.chats.currentChats;
    var connectionHub = state.chats.connectionHub;

    if (!connectionHub) {
      var newHub = connectionBuilder.build();
      await dispatch(connectToHub(newHub)).then(() =>
        dispatch(setConnectionHub(newHub)).catch(() => dispatch(removeHub()))
      );
    }

    if (openedChats.find((chat) => chat.user.id == userId)) {
      return dispatch(closeChat(userId));
    }

    return dispatch(createChat(userId));
  }
);

export const connectToHub = createAsyncThunk<any, any>(
  `${prefix}/connectToHub`,
  async (newHub: any) => (dispatch: any, getState: any) => {
    const state = getState();
    const connectionHub = state.chats.connectionHub;
    if (connectionHub) {
      return;
    }
    return newHub.start();
  }
);
const removeHub = createAction(`${prefix}/removedConnectionHub`);

const setConnectionHub = createAction<any>(`${prefix}/connectionHubSet`);

export const closeChat = createAction<number>(`${prefix}/chatClosed`);

export const createChat = createAsyncThunk<AxiosResponse<any>, number>(
  `${prefix}/chatOpened`,
  async (userId) => {
    return await Axios.get(`${CHAT_API_URL}/${userId}`);
  }
);

export const chatInitialState: ChatsState = {
  latestChats: latestChatsAdapter.getInitialState(),
  currentChats: [],
  openChatsLimit: 2,
  loadedLatestChats: false,
  connectionHub: null,
};

export const sendMessage = createAction(
  `${prefix}/messageSent`,
  (userId: number, text: string) => ({
    payload: {
      userId,
      text,
    },
  })
);

export const chatReducer = createReducer<ChatsState>(
  chatInitialState,
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
      })
      .addCase(sendMessage, (state, action) => {
        const chat = state.currentChats.find(
          (chat) => chat.user.id == action.payload.userId
        );
        if (chat) {
          chat.user.messages.push({
            id: Math.floor(Math.random() * 100000),
            date: new Date(),
            outgoing: true,
            text: action.payload.text,
          });
        }
      });
  }
);
//SELECTORS
export const selectChatsState = (state: ApplicationState) => state.chats;
export const latestsChatsSelector = latestChatsAdapter.getSelectors<ApplicationState>(
  (state) => state.chats.latestChats
);

export const currentChatsSelectorLocal = createDraftSafeSelector(
  (state: ChatsState) => state,
  (state) => state.currentChats
);
export const currentChatsSelector = createDraftSafeSelector(
  selectChatsState,
  (state) => state.currentChats
);
export const finishedChatsLoading = createDraftSafeSelector(
  selectChatsState,
  (state) => state.loadedLatestChats
);
