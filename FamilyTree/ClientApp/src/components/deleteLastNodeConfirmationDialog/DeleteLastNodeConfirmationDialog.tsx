import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
} from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { EntityId } from "@reduxjs/toolkit";
import * as React from "react";

const useStyles = makeStyles((theme: Theme) => ({}));
type Props = {
  open: boolean;
  onClose: any;
  onConfirm: any;
  nodeId: EntityId | null;
};
const DeleteLastNodeConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  nodeId,
}: Props) => {
  const classes = useStyles();

  const handleConfirm = () => {
    onConfirm(nodeId);
    onClose();
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Deleting last family member connected to FamilyTree account results in
          whole tree deletion.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirm} color="primary" autoFocus>
          Confirm
        </Button>
        <Button onClick={onClose} color="primary">
          Back
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteLastNodeConfirmationDialog;
