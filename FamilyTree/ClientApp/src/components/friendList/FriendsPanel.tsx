import {
  Badge,
  Box,
  Divider,
  IconButton,
  makeStyles,
  Paper,
  Slide,
} from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import InvitationIcon from "@material-ui/icons/InsertInvitation";
import * as React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useThunkDispatch } from "../..";
import { TREE_PAGE_URI } from "../../applicationRouting";
import { ApplicationState } from "../../helpers";
import InvitationsList from "../invitation/InvitationsList";
import {
  acceptInvitation,
  rejectInvitation,
  selectInvitations,
} from "../invitation/reducer/invitationsReducer";
import { getUser } from "../loginPage/authenticationReducer";
import TooltipMouseFollow from "../UI/TooltipMouseFollow";
import LatestChatsProvider from "./LatestChatsProvider";

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
    zIndex: 898888888888888,
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
    marginBottom: 10,
    right: 0,
    bottom: "100%",
  },
}));

const FriendsPanel = (props: any) => {
  const classes = useStyles();

  const [showInvitations, setShowInvitations] = React.useState(false);
  const dispatch = useThunkDispatch();
  const user = useSelector(getUser);
  const history = useHistory();
  const recordButtonPosition = (event: any) => {
    setShowInvitations(!showInvitations);
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
      <Paper className={classes.background}>
        <Box
          display="flex"
          justifyContent="center"
          className={classes.invitationIconContainer}
        >
          <TooltipMouseFollow title="Tree invitations">
            <IconButton onClick={recordButtonPosition}>
              <Badge
                invisible={!invitations || invitations.length === 0}
                badgeContent={invitations.length}
                color="primary"
              >
                <InvitationIcon
                  className={classes.invitationIcon}
                ></InvitationIcon>
              </Badge>
            </IconButton>
          </TooltipMouseFollow>
        </Box>

        <Divider></Divider>
        <LatestChatsProvider></LatestChatsProvider>

        <Slide in={showInvitations} timeout={1000} direction={"left"}>
          <div className={classes.invitationsAbsolute}>
            <InvitationsList
              invitations={invitations}
              onAccept={handleAcceptInvitation}
              onReject={handleRejectInvitation}
            />
          </div>
        </Slide>
      </Paper>
    </Box>
  );
};

export default FriendsPanel;
