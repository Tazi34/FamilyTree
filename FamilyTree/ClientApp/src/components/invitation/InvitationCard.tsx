import {
  Button,
  IconButton,
  ListItem,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { Invitation } from "../../model/Invitation";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";
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
    <ListItem dense>
      <ListItemText>{invitation.treeName}</ListItemText>

      <IconButton>
        <CheckCircleOutlineIcon color="primary" onClick={handleAccept} />
      </IconButton>
      <IconButton>
        <HighlightOffRoundedIcon color="error" onClick={handleReject} />
      </IconButton>
    </ListItem>
  );
};

export default InvitationCard;
