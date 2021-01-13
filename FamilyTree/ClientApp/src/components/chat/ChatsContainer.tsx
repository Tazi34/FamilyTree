import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../loginPage/authenticationReducer";
import Chat from "./Chat";
import {
  closeChat,
  currentChatsSelector,
  markChatAsSeen,
  sendMessage,
} from "./chatReducer";
const useStyles = makeStyles((theme: Theme) => ({
  chatContainer: {
    position: "relative",
    transform: "translateZ(0)",
  },
  otherContainer: {
    display: "block",
    position: "relative",
    zIndex: 1,
  },
  heightZeroContainer: {
    alignItems: "flex-end",
    display: "flex",
    position: "relative",
    height: 0,
    zIndex: 0,
  },
}));

const ChatsContainer = (props: any) => {
  const classes = useStyles();
  const currentChats = useSelector(currentChatsSelector);
  const user = useSelector(getUser);

  const dispatch = useDispatch();

  const handleChatClose = (id: number) => {
    setTimeout(() => dispatch(closeChat(id)), 1000);
  };

  const handleMessageSend = (userId: number, text: string) => {
    dispatch(sendMessage(userId, text));
  };

  const handleChatSeen = (chatId: number) => {
    dispatch(markChatAsSeen(chatId));
  };
  if (!user) {
    return null;
  }
  return (
    <div className={classes.chatContainer}>
      <div className={classes.otherContainer}>
        <div className={classes.heightZeroContainer}>
          {currentChats.map((chat) => (
            <Chat
              key={chat.userId}
              chat={chat}
              onChatClose={handleChatClose}
              onMessageSend={handleMessageSend}
              onChatSeen={handleChatSeen}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatsContainer;
