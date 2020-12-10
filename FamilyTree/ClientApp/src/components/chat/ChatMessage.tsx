import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { Message } from "./chatReducer";

const useStyles = makeStyles((theme: Theme) => ({
  message: {
    padding: "8px 12px 8px 12px",
    marginBottom: 8,
    borderRadius: 10,
  },
  outgoingMessage: {
    background: theme.palette.primary.dark,
    textAlign: "right",

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
  message: Message;
};
const ChatMessage = ({ message }: Props) => {
  const classes = useStyles();
  return (
    <div
      className={`${classes.messageContainer} ${
        message.outgoing ? classes.outgoingContainer : classes.incomingContainer
      }`}
    >
      <div
        className={`${
          message.outgoing ? classes.outgoingMessage : classes.incomingMessage
        } ${classes.message}`}
      >
        {message.text}
      </div>
    </div>
  );
};

export default ChatMessage;
