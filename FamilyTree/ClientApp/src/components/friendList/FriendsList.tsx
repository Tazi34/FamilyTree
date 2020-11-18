import { Box, List, makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { Friend } from "../../model/Friend";
import FriendEntry from "./FriendEntry";

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

const FriendsList = ({ friends }: any) => {
  const classes = useStyles();
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      className={classes.root}
    >
      {friends.map((friend: Friend) => (
        <FriendEntry friend={friend}></FriendEntry>
      ))}
    </Box>
  );
};

export default FriendsList;
