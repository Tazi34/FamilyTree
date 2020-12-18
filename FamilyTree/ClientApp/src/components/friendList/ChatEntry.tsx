import { Box, ButtonBase, makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import * as React from "react";
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
    position: "relative",
    overflow: "hidden",
    borderRadius: "50%",
    borderWidth: 2,
    cursor: "pointer",
    //disable default buttonbase outline on click
    " &:focus": { outline: "none" },
    margin: "7px 0",
  },
  profilePicture: {
    borderRadius: "50%",
    height: "100%",
    width: "100%",
    objectFit: "cover",
    border: 0,
  },
}));

const ChatEntry = ({ chatEntry, onChatClick }: Props) => {
  const classes = useStyles();
  const hasPicture = chatEntry.pictureUrl && chatEntry.pictureUrl.length > 0;
  return (
    <TooltipMouseFollow title={`${chatEntry.name} ${chatEntry.surname}`}>
      <Box
        border={0}
        borderColor="primary.dark"
        component={ButtonBase}
        className={classes.profilePictureContainer}
        onClick={() => onChatClick(chatEntry)}
      >
        {hasPicture ? (
          <img src={chatEntry.pictureUrl} className={classes.profilePicture} />
        ) : (
          <AccountCircleIcon
            className={classes.accountIcon}
          ></AccountCircleIcon>
        )}
      </Box>
    </TooltipMouseFollow>
  );
};

export default ChatEntry;
