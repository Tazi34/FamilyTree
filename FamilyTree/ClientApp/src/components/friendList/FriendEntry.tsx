import { Box, ButtonBase, makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import * as React from "react";
import { Friend } from "../../model/Friend";
import TooltipMouseFollow from "../UI/TooltipMouseFollow";

type Props = {
  friend: Friend;
  onChatOpen: (friend: Friend) => void;
};

const useStyles = makeStyles((theme: Theme) => ({
  accountIcon: {
    fontSize: 43,
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

const FriendEntry = ({ friend, onChatOpen }: Props) => {
  const classes = useStyles();
  return (
    <TooltipMouseFollow title={`${friend.name} ${friend.surname}`}>
      <Box
        border={0}
        borderColor="primary.dark"
        component={ButtonBase}
        className={classes.profilePictureContainer}
        onClick={() => onChatOpen(friend)}
      >
        {friend.image.length > 0 ? (
          <img src={friend.image} className={classes.profilePicture} />
        ) : (
          <AccountCircleIcon
            className={classes.accountIcon}
          ></AccountCircleIcon>
        )}
      </Box>
    </TooltipMouseFollow>
  );
};

export default FriendEntry;
