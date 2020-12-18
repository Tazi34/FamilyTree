import { receiveMessage } from "./../chatReducer";
import { AnyAction } from "redux";
import { sendMessage } from "../chatReducer";
import * as signalR from "@microsoft/signalr";

const connectionBuilder = new signalR.HubConnectionBuilder().withUrl(
  "https://familytree.azurewebsites.net/chatHub",
  {
    accessTokenFactory: () =>
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjEiLCJuYmYiOjE2MDc3MDk5MTAsImV4cCI6MTYwODMxNDcxMCwiaWF0IjoxNjA3NzA5OTEwfQ.J-8oxsOxnGpLWy3rZ2yRguc4FDR9w8pn4hCYB9moSwY",
  }
);

export const signalRMiddleware = (storeAPI: any) => {
  let connectionHub = connectionBuilder.build();

  connectionHub.start().catch((error) => console.log(error));

  connectionHub.on("ReceiveMessage", function (userId, message) {
    //   var msg = message
    //     .replace(/&/g, "&amp;")
    //     .replace(/</g, "&lt;")
    //     .replace(/>/g, "&gt;");
    //   var encodedMsg = user + " says " + msg;
    storeAPI.dispatch(receiveMessage(userId, message));
  });

  return (next: any) => (action: AnyAction) => {
    if (action.type === sendMessage.toString()) {
      const { userId, message } = action.payload;
      connectionHub
        .invoke("SendMessage", userId.toString(), message)
        .then((val: any) => console.log(val))
        .catch(function (err: any) {
          return console.error(err.toString());
        });
    }
    return next(action);
  };
};
