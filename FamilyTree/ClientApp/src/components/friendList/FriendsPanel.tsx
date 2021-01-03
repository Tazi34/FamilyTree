import {
  IconButton,
  Box,
  Divider,
  makeStyles,
  Paper,
  Tooltip,
  Drawer,
  Menu,
  Dialog,
  Badge,
} from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import LatestChatsProvider from "./LatestChatsProvider";
import InvitationIcon from "@material-ui/icons/InsertInvitation";
import { useThunkDispatch } from "../..";
import {
  acceptInvitation,
  getInvitations,
  rejectInvitation,
  selectInvitations,
} from "../invitation/reducer/invitationsReducer";
import { useSelector } from "react-redux";
import { ApplicationState } from "../../helpers";
import InvitationCard from "../invitation/InvitationCard";
import { getUser } from "../loginPage/authenticationReducer";
import { useHistory } from "react-router";
import { TREE_PAGE_URI } from "../../applicationRouting";

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
  invitationsAbsolute: {
    position: "absolute",
    width: 500,
    height: 300,
    background: "red",
    bottom: "100%",
  },
}));

const FriendsPanel = (props: any) => {
  const classes = useStyles();

  const [showInvitations, setShowInvitations] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<any>(null);
  const dispatch = useThunkDispatch();
  const user = useSelector(getUser);
  const history = useHistory();
  const recordButtonPosition = (event: any) => {
    setAnchorEl(event.currentTarget);
    setShowInvitations(true);
  };
  const invitations = useSelector((state: ApplicationState) =>
    selectInvitations(state.invitations.invitations)
  );

  const handleAcceptInvitation = (invitationId: number) => {
    dispatch(acceptInvitation({ invitationId, userId: user!.id })).then(
      (response: any) => {
        if (!response.error) {
          history.push(`${TREE_PAGE_URI}/${response.payload.data.treeId}`);
        }
      }
    );
  };
  const handleRejectInvitation = (invitationId: number) => {
    dispatch(rejectInvitation({ invitationId, userId: user!.id }));
  };
  return (
    <Box display="flex" flexDirection="column" className={classes.root}>
      {/* <div className={classes.spaceFiller}></div> */}
      <Paper className={classes.background}>
        <Box
          display="flex"
          justifyContent="center"
          className={classes.invitationIconContainer}
        >
          <IconButton onClick={recordButtonPosition}>
            <Badge
              invisible={!invitations || invitations.length == 0}
              badgeContent={invitations.length}
              color="primary"
            >
              <InvitationIcon
                className={classes.invitationIcon}
              ></InvitationIcon>
            </Badge>
          </IconButton>
        </Box>

        <Divider></Divider>
        <LatestChatsProvider></LatestChatsProvider>
      </Paper>
      <Dialog open={showInvitations} onClose={() => setShowInvitations(false)}>
        <div>
          {invitations.map((inv) => (
            <InvitationCard
              onAccept={handleAcceptInvitation}
              onReject={handleRejectInvitation}
              key={inv.invitationId}
              invitation={inv}
            />
          ))}
        </div>
      </Dialog>
    </Box>
  );
};

export default FriendsPanel;
