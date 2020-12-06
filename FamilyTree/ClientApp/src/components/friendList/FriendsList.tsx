import { Box, Divider, List, makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { Friend } from "../../model/Friend";
import FriendEntry from "./FriendEntry";

type Props = {
  friendsLimit: number;
  friends: Friend[];
  onChatOpen: (friend: Friend) => void;
};
const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

const FriendsList = ({ friends, friendsLimit, onChatOpen }: Props) => {
  const classes = useStyles();

  const friendsToShow =
    friends.length > friendsLimit ? friends.slice(0, friendsLimit) : friends;
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      className={classes.root}
    >
      {friendsToShow.map((friend: Friend) => (
        <div>
          <FriendEntry onChatOpen={onChatOpen} friend={friend}></FriendEntry>
          <Divider />
        </div>
      ))}
    </Box>
  );
};

export default FriendsList;
