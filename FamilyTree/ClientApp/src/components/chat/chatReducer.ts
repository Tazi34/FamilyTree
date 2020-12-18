import { AxiosResponse } from "axios";
import {
  createAction,
  createAsyncThunk,
  createDraftSafeSelector,
  createEntityAdapter,
  createReducer,
  EntityState,
} from "@reduxjs/toolkit";
import { ApplicationState } from "../../helpers";
import chatAPI from "./API/chatAPI";

import { getLatestChats } from "./reducer/getLatestChats";
import { GetChatResponse } from "./API/getChat";

export type Message = {
  creationTime: Date;
  text: string;
  fromId: number;
  toId: number;
};
export type Chat = {
  userId: number;
  pictureUrl: string;
  name: string;
  surname: string;
  lastMessageTime: string;
  messages: Message[];
  loadedMessages: boolean;
};

export type ChatsState = {
  chats: EntityState<Chat>;
  latestChats: number[];
  currentChats: number[];
  loadedLatestChats: boolean;
  openChatsLimit: number;
};

export const chatActionsPrefix = "chat";

const chatsAdapter = createEntityAdapter<Chat>({
  selectId: (chat) => chat.userId,
});
export const chatsSelectors = chatsAdapter.getSelectors(
  (state: ApplicationState) => state.chats.chats
);
export const chatsSelectorsLocal = chatsAdapter.getSelectors(
  (state: EntityState<Chat>) => state
);

export const tryOpenChat = createAsyncThunk(
  "openChat",
  async (userId: number, { getState, dispatch }) => {
    const state = getState() as ApplicationState;
    const openedChats = state.chats.currentChats;

    if (openedChats.find((chatId) => chatId == userId)) {
      return dispatch(closeChat(userId));
    } else {
      const chat = chatsSelectors.selectById(state, userId);
      if (chat) {
        dispatch(openChat(userId));
        if (!chat.loadedMessages) {
          dispatch(getMessages(chat));
        }
      } else {
        dispatch(getChat(userId)).then(() => dispatch(tryOpenChat(userId)));
      }
    }
  }
);
export const getMessages = createAsyncThunk(
  `${chatActionsPrefix}/getMessages`,
  async (chat: Chat) => {
    return await chatAPI.requestMessages({ id: chat.userId });
  }
);
export const getChat = createAsyncThunk<AxiosResponse<GetChatResponse>, number>(
  `${chatActionsPrefix}/getChat`,
  async (userId: number) => {
    return await chatAPI.requestChat({ id: userId });
  }
);

export const closeChat = createAction<number>(
  `${chatActionsPrefix}/chatClosed`
);

export const openChat = createAction<number>(`${chatActionsPrefix}/chatOpened`);

export const chatInitialState: ChatsState = {
  chats: chatsAdapter.getInitialState(),
  latestChats: [],
  currentChats: [],
  openChatsLimit: 2,
  loadedLatestChats: false,
};

export const sendMessage = createAction(
  `${chatActionsPrefix}/messageSent`,
  (userId: number, message: string) => ({
    payload: {
      userId,
      message,
    },
  })
);
export const receiveMessage = createAction(
  `${chatActionsPrefix}/messageReceived`,
  (userId: number, message: string) => ({
    payload: {
      userId,
      message,
    },
  })
);

export const chatReducer = createReducer<ChatsState>(
  chatInitialState,
  (builder) => {
    builder
      .addCase(getMessages.fulfilled, (state, action) => {
        const chatId = action.meta.arg.userId;
        const chat = state.chats.entities[chatId];
        if (!chat) {
          throw "Chat not found";
        }
        chat.loadedMessages = true;
        chat.messages = action.payload.data.messageList;
      })
      .addCase(getLatestChats.fulfilled, (state, action) => {
        const chats: Chat[] = action.payload.data.usersList;
        chats.forEach((chat) => {
          chat.messages = [];
          chat.loadedMessages = false;
        });

        state.loadedLatestChats = true;
        state.latestChats = chats.map((chat) => chat.userId);
        chatsAdapter.setAll(state.chats, chats);
      })
      .addCase(openChat, (state, action) => {
        const chatId = action.payload;
        var currentChatsExcludingSelected = state.currentChats.filter(
          (currentChatId) => currentChatId != chatId
        );
        if (currentChatsExcludingSelected.length >= state.openChatsLimit) {
          currentChatsExcludingSelected = currentChatsExcludingSelected.slice(
            0,
            state.openChatsLimit - 1
          );
        }
        currentChatsExcludingSelected.push(chatId);
        state.currentChats = currentChatsExcludingSelected;
      })
      .addCase(closeChat, (state, action) => {
        const chatId = action.payload;
        state.currentChats = state.currentChats.filter(
          (currentChatId) => currentChatId != chatId
        );
      })
      .addCase(receiveMessage, (state, action) => {
        const { message, userId } = action.payload;
        const chat = state.chats.entities[userId];
        if (chat && chat.loadedMessages) {
          chat.messages.push({
            text: message,
            fromId: userId,
            toId: -1,
            creationTime: new Date(),
          });
        }
      })
      .addCase(getChat.fulfilled, (state, action) => {
        const chat = action.payload.data;
        chat.loadedMessages = false;
        chat.messages = [];

        chatsAdapter.addOne(state.chats, chat);
      })
      .addCase(sendMessage, (state, action) => {
        const { message, userId } = action.payload;
        const chat = state.chats.entities[userId];
        if (!chat) {
          throw "Chat not found";
        }
        if (chat && chat.loadedMessages) {
          chat.messages.push({
            text: message,
            fromId: -1,
            toId: userId,
            creationTime: new Date(),
          });
        }
      });
  }
);
//SELECTORS
export const selectChatsState = (state: ApplicationState) => state.chats;

export const currentChatsSelectorLocal = createDraftSafeSelector(
  (state: ChatsState) => state,
  (state) => state.currentChats
);
export const currentChatsSelector = createDraftSafeSelector(
  selectChatsState,
  (state) =>
    state.currentChats
      .map((chatId) => chatsSelectorsLocal.selectById(state.chats, chatId))
      .filter((chat) => chat) as Chat[]
);
export const finishedChatsLoading = createDraftSafeSelector(
  selectChatsState,
  (state) => state.loadedLatestChats
);

export const latestChatsSelector = createDraftSafeSelector(
  selectChatsState,
  (state) =>
    state.latestChats
      .map((chatId) => chatsSelectorsLocal.selectById(state.chats, chatId))
      .filter((chat) => chat) as Chat[]
);
