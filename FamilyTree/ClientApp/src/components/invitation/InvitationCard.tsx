import { Button, ListItem, makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { Invitation } from "../../model/Invitation";

const useStyles = makeStyles((theme: Theme) => ({}));
type Props = {
  invitation: Invitation;
  onAccept: (invitationId: number) => void;
  onReject: (invitationId: number) => void;
};
const InvitationCard = ({ invitation, onAccept, onReject }: Props) => {
  const classes = useStyles();
  const handleAccept = () => {
    onAccept(invitation.invitationId);
  };
  const handleReject = () => {
    onReject(invitation.invitationId);
  };
  return (
    <ListItem>
      {invitation.treeName}
      <Button onClick={handleAccept}>Accept</Button>
      <Button onClick={handleReject}>Reject</Button>
    </ListItem>
  );
};

export default InvitationCard;
