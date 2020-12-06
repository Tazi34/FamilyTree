import {
  Box,
  Button,
  ButtonBase,
  Divider,
  IconButton,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import React, { useState } from "react";
import CloseIcon from "@material-ui/icons/Close";
import { Chat as ChatType } from "./chatReducer";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
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
    height: 570,
    background: "white",
    width: 328,
  },
  chat: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  chatTopBar: {
    display: "flex",
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
    width: 32,
    height: 32,
    marginRight: 8,
    borderRadius: "50%",
  },
  profilePicture: {
    height: "100%",
    width: "100%",
    borderRadius: "50%",
  },
  defaultProfileIcon: {
    border: "50%",
    fontSize: 32,
  },
  chatTextArea: {
    flexGrow: 1,
    overflowY: "hidden",
  },
  bottomChatBar: {
    height: 30,
  },
}));
type Props = {
  chat: ChatType;
  onChatClose: (id: number) => void;
};
const Chat = ({ chat, onChatClose }: Props) => {
  const classes = useStyles();
  const { user } = chat;

  const handleChatClose = () => {
    onChatClose(user.id);
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
              <Typography variant="h6">
                {user.name} {user.surname}
              </Typography>
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
            <div className={classes.chatTextArea}></div>
            <Divider />
            <div className={classes.bottomChatBar}></div>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default Chat;
