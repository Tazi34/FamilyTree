import { Box, Divider, makeStyles, Paper } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import LatestChatsProvider from "./LatestChatsProvider";
import InvitationIcon from "@material-ui/icons/InsertInvitation";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: "100%",
    width: "100%",
  },
  background: {
    padding: 7,
    right: 10,
    bottom: 0,
    position: "fixed",
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
    <Box display="flex" flexDirection="column" className={classes.root}>
      {/* <div className={classes.spaceFiller}></div> */}
      <Paper className={classes.background}>
        <Box
          display="flex"
          justifyContent="center"
          className={classes.invitationIconContainer}
        >
          <InvitationIcon className={classes.invitationIcon}></InvitationIcon>
        </Box>

        <Divider></Divider>
        <LatestChatsProvider></LatestChatsProvider>
      </Paper>
    </Box>
  );
};

export default FriendsPanel;
