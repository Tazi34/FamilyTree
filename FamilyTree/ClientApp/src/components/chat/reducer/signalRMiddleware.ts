import {
  authenticateFacebookToken,
  authenticateGmailToken,
} from "./../../loginPage/authenticationReducer";
import { connectionReducer } from "./../../tree/connectionReducer";
import * as signalR from "@microsoft/signalr";
import { AnyAction } from "redux";
import { boolean } from "yup/lib/locale";
import { ApplicationState } from "../../../helpers";
import { logger } from "../../../helpers/logger";
import {
  createUser,
  loginUser,
  logoutUser,
} from "../../loginPage/authenticationReducer";
import { tokenLocalStorageKey } from "../../loginPage/tokenService";
import { onReceiveMessage, sendMessage } from "../chatReducer";
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
const startSignalRConnection = async (connection: any) => {
  try {
    await connection.start();
    console.assert(connection.state === signalR.HubConnectionState.Connected);
    console.log("SignalR connection established");
  } catch (err) {
    console.assert(
      connection.state === signalR.HubConnectionState.Disconnected
    );
    console.error("SignalR Connection Error: ", err);
    setTimeout(() => startSignalRConnection(connection), 5000);
  }
};

const buildConnection = (storeAPI: any, token?: string) => {
  if (!token) {
    return null;
  }
  let connectionHub = connectionBuilder(token as string).build();
  connectionHub.on("ReceiveMessage", function (userId, message) {
    const state: ApplicationState = storeAPI.getState();
    const currentUserId = state.authentication.user!.id;

    logger.log("Received message " + message + " from " + userId);

    storeAPI.dispatch(onReceiveMessage(userId, message, currentUserId));
  });
  connectionHub.onreconnected(() => handleConnectionReconnected(storeAPI));
  connectionHub.onclose(() => logger.log("Closing connection"));
  startSignalRConnection(connectionHub);
  return connectionHub;
};

const loginSuccessActions = [
  loginUser.fulfilled.toString(),
  createUser.fulfilled.toString(),
  authenticateFacebookToken.fulfilled.toString(),
  authenticateGmailToken.fulfilled.toString(),
];
export const signalRMiddleware = (storeAPI: any) => {
  const state: ApplicationState = storeAPI.getState();
  let token = state.authentication.user?.token;
  if (!token) {
    token = localStorage[tokenLocalStorageKey];
  }
  let connectionHub = buildConnection(storeAPI, token);

  return (next: any) => (action: AnyAction) => {
    if (!action) {
      return next();
    }

    if (loginSuccessActions.includes(action.type)) {
      token = action.payload.data.token;
      console.log("TOKEN " + token);
      connectionHub = buildConnection(storeAPI, token);
    }

    if (connectionHub) {
      if (action.type === logoutUser.toString()) {
        connectionHub.stop().then(() => {
          console.log("connection stopped");
        });
      }
      if (action.type === sendMessage.toString()) {
        const { userId, message } = action.payload;
        const state: ApplicationState = storeAPI.getState();
        const currentUserId = state.authentication.user!.id;
        action.payload.senderId = currentUserId;
        var sentMessage = true;
        connectionHub
          .invoke("SendMessage", userId.toString(), message)
          .then(() => logger.log("Send message: " + message))
          .catch(function (err: any) {
            sentMessage = false;
            logger.error("Didnt send message");
          });
        if (!sentMessage) {
          return next();
        }
      }
    }
    return next(action);
  };
};
const handleConnectionReconnected = ({ dispatch, getState }: any) => {
  const state: ApplicationState = getState();
  logger.log("reconnecting");
  const chats = chatsSelectorsLocal.selectAll(state.chats.chats);
  const alreadyLoadedChats = chats.filter((chat) => chat.loadedMessages);
  alreadyLoadedChats.forEach((chat) => {
    dispatch(getMessages(chat));
  });
};
