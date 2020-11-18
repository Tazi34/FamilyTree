import { Box, Divider, makeStyles, Paper } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import FriendsListProvider from "./FriendsListProvider";
import InvitationIcon from "@material-ui/icons/InsertInvitation";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: "100%",
  },
  background: {
    maxWidth: 50,
    padding: 7,
  },
  spaceFiller: {
    flex: 0.5,
  },
  invitationIconContainer: {
    width: "100%",
    padding: 5,
  },
  invitationIcon: {
    fontSize: 30,
  },
}));

const FriendsPanel = (props: any) => {
  const classes = useStyles();
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      className={classes.root}
    >
      <div className={classes.spaceFiller}></div>
      <Paper className={classes.background}>
        <Box
          display="flex"
          justifyContent="center"
          className={classes.invitationIconContainer}
        >
          <InvitationIcon className={classes.invitationIcon}></InvitationIcon>
        </Box>

        <Divider></Divider>
        <FriendsListProvider></FriendsListProvider>
      </Paper>
    </Box>
  );
};

export default FriendsPanel;
