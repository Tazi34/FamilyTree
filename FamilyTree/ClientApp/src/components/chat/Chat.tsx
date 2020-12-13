import {
  Box,
  Button,
  ButtonBase,
  Divider,
  IconButton,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import * as signalR from "@microsoft/signalr";

import { Theme } from "@material-ui/core/styles";
import React, { useState } from "react";
import CloseIcon from "@material-ui/icons/Close";
import { Chat as ChatType } from "./chatReducer";
import SendIcon from "@material-ui/icons/Send";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ChatMessage from "./ChatMessage";
import { Formik } from "formik";
const useStyles = makeStyles((theme: Theme) => ({
  chatTab: {
    position: "relative",
    display: "flex",
    bottom: 0,
    right: 100,
  },
  chatWindow: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginLeft: 10,
    height: 470,
    background: "white",
    width: 328,
    transform: "translateZ(0)",
  },
  chat: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  chatTopBar: {
    display: "flex",
    alignItems: "center",
    padding: 8,
    "&:focus": {
      outline: "none",
    },
  },
  chatBody: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
  },
  chatTopBarTitle: {
    flexGrow: 1,
    display: "flex",
  },
  chatTopBarButtons: {},
  iconButton: {
    "&:focus": {
      outline: "none",
    },
    padding: 0,
  },
  pictureContainer: {
    width: 34,
    height: 34,
    marginRight: 8,
    borderRadius: "50%",
    borderWidth: 2,
  },
  profilePicture: {
    height: "100%",
    width: "100%",
    borderRadius: "50%",
  },
  defaultProfileIcon: {
    border: "50%",
    fontSize: 42,
  },
  chatTextArea: {
    flexGrow: 1,
    overflowY: "hidden",
    padding: 8,
  },
  bottomChatBar: {
    height: 50,
    display: "flex",
    padding: 8,
  },
  textInputContainer: {
    flexGrow: 1,
    marginRight: 8,
    padding: 5,
    borderWidth: 2,
    borderRadius: 10,
  },
  textInput: {
    width: "100%",
    "&:focus": {
      outline: "none",
    },
    border: "none",
  },
  titleContainer: {
    display: "flex",
    alignItems: "center",
  },
}));
type Props = {
  chat: ChatType;
  onChatClose: (id: number) => void;
  onMessageSend: (id: number, text: string) => void;
};
const Chat = ({ chat, onChatClose, onMessageSend }: Props) => {
  const classes = useStyles();
  const { user } = chat;

  const handleChatClose = () => {
    onChatClose(user.id);
  };
  const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://familytree.azurewebsites.net/chatHub", {
      accessTokenFactory: () =>
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjEiLCJuYmYiOjE2MDc3MDk5MTAsImV4cCI6MTYwODMxNDcxMCwiaWF0IjoxNjA3NzA5OTEwfQ.J-8oxsOxnGpLWy3rZ2yRguc4FDR9w8pn4hCYB9moSwY",
    })
    .build();

  connection
    .start()
    .then((val: any) => console.log(val))
    .catch((err: any) => console.log(err));

  connection.on("ReceiveMessage", function (user, message) {
    var msg = message
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    var encodedMsg = user + " says " + msg;
    console.log(`Received ${encodedMsg}`);
  });

  const sendMessage = (id: number, msg: string) => {
    console.log(id);
    console.log(msg);
    connection
      .invoke("SendMessage", id.toString(), msg)
      .then((val: any) => console.log(val))
      .catch(function (err) {
        return console.error(err.toString());
      });
  };

  return (
    <div className={classes.chatTab}>
      <Box
        border={1}
        borderColor="primary.dark"
        component={Paper}
        className={classes.chatWindow}
      >
        <div className={classes.chat}>
          <Box component={ButtonBase} className={classes.chatTopBar}>
            <div className={classes.chatTopBarTitle}>
              <Box
                border={1}
                borderColor="primary.dark"
                className={classes.pictureContainer}
              >
                {user.image.length > 0 ? (
                  <img src={user.image} className={classes.profilePicture} />
                ) : (
                  <AccountCircleIcon
                    className={classes.defaultProfileIcon}
                  ></AccountCircleIcon>
                )}
              </Box>
              <div className={classes.titleContainer}>
                <Typography variant="h6">
                  {user.name} {user.surname}
                </Typography>
              </div>
            </div>
            <div className={classes.chatTopBarButtons}>
              <IconButton
                size="small"
                className={classes.iconButton}
                onClick={handleChatClose}
              >
                <CloseIcon />
              </IconButton>
            </div>
          </Box>
          <Divider />
          <div className={classes.chatBody}>
            <div className={classes.chatTextArea}>
              {chat.user.messages.map((m) => (
                <ChatMessage message={m} />
              ))}
            </div>
            <Divider />

            <Formik
              initialValues={{ message: "" }}
              onSubmit={(values, { resetForm }) => {
                sendMessage(chat.user.id, values.message);
                //onMessageSend(chat.user.id, values.message);
                resetForm();
              }}
            >
              {({ setFieldTouched, handleChange, handleSubmit, values }) => {
                const change = (name: string, e: any) => {
                  e.persist();
                  handleChange(e);
                  setFieldTouched(name, true, false);
                };
                return (
                  <form
                    onSubmit={handleSubmit}
                    className={classes.bottomChatBar}
                  >
                    <Box
                      border={1}
                      borderColor="primary.light"
                      className={classes.textInputContainer}
                    >
                      <input
                        autoComplete={"off"}
                        name="message"
                        value={values.message}
                        className={classes.textInput}
                        onChange={change.bind(null, "message")}
                      />
                    </Box>
                    <IconButton
                      color="primary"
                      type="submit"
                      className={classes.iconButton}
                    >
                      <SendIcon />
                    </IconButton>
                  </form>
                );
              }}
            </Formik>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default Chat;
