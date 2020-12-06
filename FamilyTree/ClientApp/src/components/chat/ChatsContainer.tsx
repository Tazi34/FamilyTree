import { Button, makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Chat from "./Chat";
import {
  closeChat,
  currentChatsSelector,
  latestsChatsSelector,
  selectChatsState,
} from "./chatReducer";
const useStyles = makeStyles((theme: Theme) => ({
  chatContainer: {
    position: "relative",
    transform: "translateZ(0)",
  },
  otherContainer: {
    display: "flex",
    position: "relative",
    zIndex: 1,

    alignItems: "flexEnd",
  },
}));

const ChatsContainer = (props: any) => {
  const classes = useStyles();
  const currentChats = useSelector(currentChatsSelector);
  const dispatch = useDispatch();

  const handleChatClose = (id: number) => {
    dispatch(closeChat(id));
  };
  return (
    <div className={classes.chatContainer}>
      <div className={classes.otherContainer}>
        {currentChats.map((chat) => (
          <Chat chat={chat} onChatClose={handleChatClose} />
        ))}
      </div>
    </div>
  );
};

export default ChatsContainer;
