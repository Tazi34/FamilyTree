import { Avatar, Box, ButtonBase, makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import * as React from "react";
import { formatInitials } from "../../helpers/formatters";
import { Chat } from "../chat/chatReducer";
import TooltipMouseFollow from "../UI/TooltipMouseFollow";

type Props = {
  chatEntry: Chat;

  onChatClick: (chatEntry: Chat) => void;
};

const useStyles = makeStyles((theme: Theme) => ({
  accountIcon: {
    fontSize: 44,
    borderRadius: "50%",

    objectFit: "cover",
  },
  profilePictureContainer: {
    width: 42,
    height: 42,

    borderWidth: 2,
    cursor: "pointer",

    margin: "7px 0",
  },
  profilePicture: {
    width: 42,
    height: 42,
    border: "solid " + theme.palette.primary.dark,
    borderWidth: 2,
    cursor: "pointer",

    margin: "7px 0",
  },
}));

const ChatEntry = ({ chatEntry, onChatClick }: Props) => {
  const classes = useStyles();
  const hasPicture = chatEntry.pictureUrl && chatEntry.pictureUrl.length > 0;
  return (
    <TooltipMouseFollow title={`${chatEntry.name} ${chatEntry.surname}`}>
      <Avatar
        src={chatEntry.pictureUrl}
        className={classes.profilePicture}
        onClick={() => onChatClick(chatEntry)}
      >
        {formatInitials(chatEntry.name, chatEntry.surname)}
      </Avatar>
    </TooltipMouseFollow>
  );
};

export default ChatEntry;
