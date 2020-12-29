import * as signalR from "@microsoft/signalr";
import { AnyAction } from "redux";
import { boolean } from "yup/lib/locale";
import { ApplicationState } from "../../../helpers";
import { loginUser } from "../../loginPage/authenticationReducer";
import { tokenLocalStorageKey } from "../../loginPage/tokenService";
import { sendMessage } from "../chatReducer";
import { baseURL } from "./../../../helpers/apiHelpers";
import {
  chatsSelectorsLocal,
  getMessages,
  receiveMessage,
} from "./../chatReducer";

const connectionBuilder = (token: string) =>
  new signalR.HubConnectionBuilder().withUrl(
    //"https://familytree.azurewebsites.net/chatHub",
    `${baseURL}/chatHub`,
    {
      accessTokenFactory: () => token,
    }
  );

export const signalRMiddleware = (storeAPI: any) => {
  const state: ApplicationState = storeAPI.getState();
  let token = state.authentication.user?.token;
  if (!token) {
    token = localStorage[tokenLocalStorageKey];
  }

  let connectionHub = connectionBuilder(token as string).build();

  connectionHub
    .start()
    .then(() => console.info("connnection started"))
    .catch((error) => console.error(error));

  connectionHub.on("ReceiveMessage", function (userId, message) {
    const state: ApplicationState = storeAPI.getState();
    const currentUserId = state.authentication.user!.id;
    console.log(currentUserId);
    console.log("Received message " + message + " from " + userId);

    storeAPI.dispatch(receiveMessage(userId, message, currentUserId));
  });

  connectionHub.onreconnected(() => handleConnectionReconnected(storeAPI));

  connectionHub.onclose(() => console.log("Closing connection"));

  return (next: any) => (action: AnyAction) => {
    if (!action) {
      return next();
    }
    if (action.type === loginUser.fulfilled.toString()) {
      connectionHub = connectionBuilder(action.payload.data.token).build();
    }
    if (action.type === sendMessage.toString()) {
      const { userId, message } = action.payload;
      const state: ApplicationState = storeAPI.getState();
      const currentUserId = state.authentication.user!.id;
      action.payload.senderId = currentUserId;
      var sentMessage = true;
      connectionHub
        .invoke("SendMessage", userId.toString(), message)
        .then(() => console.info("Send message: " + message))
        .catch(function (err: any) {
          sentMessage = false;
          console.error("Didnt send message");
        });
      if (!sentMessage) {
        return next();
      }
    }
    return next(action);
  };
};
const handleConnectionReconnected = ({ dispatch, getState }: any) => {
  const state: ApplicationState = getState();
  console.log("reconnecting");
  const chats = chatsSelectorsLocal.selectAll(state.chats.chats);
  const alreadyLoadedChats = chats.filter((chat) => chat.loadedMessages);
  alreadyLoadedChats.forEach((chat) => {
    dispatch(getMessages(chat));
  });
};
