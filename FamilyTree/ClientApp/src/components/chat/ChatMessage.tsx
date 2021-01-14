import { Avatar, makeStyles, Tooltip, Typography } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { format } from "date-fns";
import * as React from "react";
import { useSelector } from "react-redux";
import { ApplicationState } from "../../helpers";
import { Message } from "./chatReducer";

const useStyles = makeStyles((theme: Theme) => ({
  message: {
    padding: "6px 12px",

    borderRadius: 10,
    maxWidth: "70%",
    wordBreak: "break-all",
    fontSize: 15,
  },
  outgoingMessage: {
    background: theme.palette.primary.dark,
    textAlign: "left",
    marginRight: 12,
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
    marginBottom: 8,
  },
  outgoingContainer: { justifyContent: "flex-end" },
  incomingContainer: { justifyContent: "flex-start" },
  avatarContainer: {
    width: 34,
    height: 34,
    marginRight: 4,
    alignSelf: "flex-end",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
}));
type Props = {
  receiverId: number;
  message: Message;
  isLastInSegment: boolean;
  isOutgoing: boolean;
};
const ChatMessage = ({ message, isOutgoing, isLastInSegment }: Props) => {
  const classes = useStyles();

  const pictureUrl = useSelector<ApplicationState, string>(
    (state) => state.chats.chats.entities[message.fromId]?.pictureUrl ?? ""
  );
  return (
    <div
      className={`${classes.messageContainer} ${
        isOutgoing ? classes.outgoingContainer : classes.incomingContainer
      }`}
    >
      {!isOutgoing && (
        <div className={classes.avatarContainer}>
          {isLastInSegment && (
            <Avatar src={pictureUrl} className={classes.avatar} />
          )}
        </div>
      )}
      <Tooltip
        title={format(new Date(message.creationTime), "HH:mm dd.MM.yyyy")}
      >
        <Typography
          style={{ whiteSpace: "pre-line" }}
          className={`${
            isOutgoing ? classes.outgoingMessage : classes.incomingMessage
          } ${classes.message}`}
        >
          {message.text}
        </Typography>
      </Tooltip>
    </div>
  );
};

export default ChatMessage;
