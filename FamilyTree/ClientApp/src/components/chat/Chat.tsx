import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  CardActionArea,
  Divider,
  IconButton,
  Input,
  makeStyles,
  Paper,
  Slide,
  TextField,
  Typography,
} from "@material-ui/core";
import * as signalR from "@microsoft/signalr";

import { Theme, useTheme } from "@material-ui/core/styles";
import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "@material-ui/icons/Close";
import { Chat as ChatType, Message } from "./chatReducer";
import SendIcon from "@material-ui/icons/Send";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ChatMessage from "./ChatMessage";
import { Formik } from "formik";
import { formatInitials } from "../../helpers/formatters";
import { useHistory } from "react-router";
import { BLOG_PAGE_URI } from "../../applicationRouting";
import Blinking from "../UI/Blinking";

const useStyles = makeStyles<any, any>((theme: Theme) => ({
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
    overflow: "hidden",
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

  profilePicture: {
    marginRight: 8,
    width: 34,
    height: 34,
    borderWidth: 2,
  },
  defaultProfileIcon: {
    border: "50%",
    height: "100%",
    width: "100%",
    fontSize: 34,
  },
  chatTextArea: {
    flexGrow: 1,
    overflowY: "auto",
    overscrollBehavior: "contain",
    overflowX: "hidden",
    position: "relative",
    padding: 8,
    flexBasis: 0,
  },
  bottomChatBar: {
    flexBasis: 50,
    display: "flex",
    padding: 8,
    flexShrink: 0,
  },
  textInputContainer: {
    flexGrow: 1,
    marginRight: 8,

    borderWidth: 2,
    borderRadius: 10,
    maxHeight: 90,

    overflowY: "auto",
  },
  textInput: {
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
  onChatSeen: (id: number) => void;
};
const Chat = ({ chat, onChatClose, onMessageSend, onChatSeen }: Props) => {
  const classes = useStyles({ unseenMessages: chat.unseen });
  const [open, setOpen] = React.useState(true);

  const theme = useTheme();
  const history = useHistory();

  const handleChatClose = (e: any) => {
    e.stopPropagation();
    setOpen(false);

    onChatClose(chat.userId);
  };
  const scrollRef = useRef(null);

  useEffect(() => {
    const element = scrollRef.current as any;
    element.scrollTop = element.scrollHeight;
  }, [chat]);

  const redirectToUserProfile = () => {
    const targetPath = `${BLOG_PAGE_URI}/${chat.userId}`;
    if (history.location.pathname !== targetPath) {
      history.push(targetPath);
    }
  };
  return (
    <Slide in={open} direction="up" timeout={1000}>
      <div className={classes.chatTab} onClick={() => onChatSeen(chat.userId)}>
        <Box component={Paper} className={classes.chatWindow}>
          <div className={classes.chat}>
            <Blinking
              blink={chat.unseen}
              background={theme.palette.primary.light}
            >
              <Box
                component={CardActionArea}
                className={`${classes.chatTopBar} blink`}
                onClick={redirectToUserProfile}
              >
                <div className={classes.chatTopBarTitle}>
                  <Avatar
                    src={chat.pictureUrl}
                    className={classes.profilePicture}
                  >
                    {formatInitials(chat.name, chat.surname)}
                  </Avatar>

                  <div className={classes.titleContainer}>
                    <Typography variant="h6">
                      {chat.name} {chat.surname}
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
            </Blinking>

            <Divider />
            <div className={classes.chatBody}>
              <div className={classes.chatTextArea} ref={scrollRef}>
                {chat.messages.map((message, index) => (
                  <ChatMessage
                    key={index}
                    message={message}
                    receiverId={chat.userId}
                    isOutgoing={message.toId === chat.userId}
                    isLastInSegment={isLastInSegment(
                      message,
                      chat.messages,
                      index
                    )}
                  />
                ))}
              </div>
              <Divider />

              <Formik
                initialValues={{ message: "" }}
                onSubmit={(values, { resetForm }) => {
                  console.log(values.message);
                  onMessageSend(chat.userId, values.message);
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
                    <form className={classes.bottomChatBar}>
                      <Box
                        border={1}
                        borderColor="primary.light"
                        className={classes.textInputContainer}
                      >
                        <Input
                          disableUnderline
                          fullWidth
                          type="submit"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              if (values.message.length > 0) handleSubmit();
                              e.preventDefault();
                            }
                          }}
                          multiline={true}
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
    </Slide>
  );
};

export default Chat;

const isLastInSegment = (
  currentMessage: Message,
  messages: Message[],
  index: number
) => {
  if (index + 1 < messages.length) {
    return currentMessage.fromId !== messages[index + 1].fromId;
  }
  if (index + 1 == messages.length) return true;
  return false;
};
