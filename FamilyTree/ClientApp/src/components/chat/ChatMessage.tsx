import { makeStyles, Typography } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { Message } from "./chatReducer";

const useStyles = makeStyles((theme: Theme) => ({
  message: {
    padding: "8px 12px 8px 12px",
    marginBottom: 8,
    borderRadius: 10,
    maxWidth: "70%",
    wordBreak: "break-all",
  },
  outgoingMessage: {
    background: theme.palette.primary.dark,
    textAlign: "left",

    color: theme.palette.getContrastText(theme.palette.primary.dark),
  },
  incomingMessage: {
    background: theme.palette.primary.light,
    textAlign: "left",

    color: theme.palette.getContrastText(theme.palette.primary.light),
  },
  messageContainer: {
    display: "flex",
    width: "100%",
  },
  outgoingContainer: { justifyContent: "flex-end" },
  incomingContainer: { justifyContent: "flex-start" },
}));
type Props = {
  receiverId: number;
  message: Message;
};
const ChatMessage = ({ receiverId, message }: Props) => {
  const classes = useStyles();
  const isOutgoing = message.toId === receiverId;

  return (
    <div
      className={`${classes.messageContainer} ${
        isOutgoing ? classes.outgoingContainer : classes.incomingContainer
      }`}
    >
      <Typography
        className={`${
          isOutgoing ? classes.outgoingMessage : classes.incomingMessage
        } ${classes.message}`}
      >
        {message.text}
      </Typography>
    </div>
  );
};

export default ChatMessage;
