import { Avatar, Badge, Box, ButtonBase, makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import * as React from "react";
import { useThunkDispatch } from "../..";
import { formatInitials } from "../../helpers/formatters";
import { Chat, markChatAsSeen } from "../chat/chatReducer";
import Blinking from "../UI/Blinking";
import TooltipMouseFollow from "../UI/TooltipMouseFollow";

type Props = {
  chatEntry: Chat;

  onChatClick: (chatEntry: Chat) => void;
};

const useStyles = makeStyles((theme: Theme) => ({
  profilePicture: {
    width: 42,
    height: 42,
    border: "solid " + theme.palette.primary.dark,
    borderWidth: 2,
    cursor: "pointer",

    margin: "7px 0",
  },
  badge: {
    marginRight: 5,
    marginTop: 5,
  },
}));

const ChatEntry = ({ chatEntry, onChatClick }: Props) => {
  const classes = useStyles();
  const dispatch = useThunkDispatch();
  const handleChatClick = () => {
    onChatClick(chatEntry);
    if (chatEntry.unseen) {
      dispatch(markChatAsSeen(chatEntry.userId));
    }
  };
  return (
    <TooltipMouseFollow title={`${chatEntry.name} ${chatEntry.surname}`}>
      {chatEntry.unseen ? (
        <Badge color="primary" badgeContent="!">
          <Avatar
            src={chatEntry.pictureUrl}
            className={classes.profilePicture}
            onClick={handleChatClick}
          >
            {formatInitials(chatEntry.name, chatEntry.surname)}
          </Avatar>
        </Badge>
      ) : (
        <Avatar
          src={chatEntry.pictureUrl}
          className={classes.profilePicture}
          onClick={handleChatClick}
        >
          {formatInitials(chatEntry.name, chatEntry.surname)}
        </Avatar>
      )}
    </TooltipMouseFollow>
  );
};

export default ChatEntry;
