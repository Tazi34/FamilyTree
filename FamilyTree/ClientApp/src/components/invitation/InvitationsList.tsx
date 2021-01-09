import {
  Divider,
  ListSubheader,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";

import * as React from "react";
import { Invitation } from "../../model/Invitation";
import InvitationCard from "./InvitationCard";
import List from "@material-ui/core/List";

const useStyles = makeStyles((theme: Theme) => ({
  invitationsList: {
    minWidth: 200,
    padding: 10,

    background: theme.palette.background.paper,
    border: "1px solid green",
  },
}));

type Props = {
  onAccept: (invitationId: number) => void;
  onReject: (invitationId: number) => void;
  invitations: Invitation[];
};
const InvitationsList = ({ onAccept, onReject, invitations }: Props) => {
  const classes = useStyles();
  const hasInvitations = invitations && invitations.length > 0;
  return (
    <List
      className={classes.invitationsList}
      subheader={
        <ListSubheader style={{ position: "static" }}>
          Pending invitations
        </ListSubheader>
      }
    >
      {!hasInvitations && (
        <Typography>You have no pending invitations</Typography>
      )}
      {invitations.map((inv) => (
        <div key={inv.invitationId}>
          <Divider />
          <InvitationCard
            invitation={inv}
            onAccept={onAccept}
            onReject={onReject}
          />
        </div>
      ))}
    </List>
  );
};

export default React.memo(InvitationsList);
