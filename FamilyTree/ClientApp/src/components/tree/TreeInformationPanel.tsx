import {
  Button,
  Dialog,
  IconButton,
  makeStyles,
  TextField,
} from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import React, { useState } from "react";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import SearchUsersContainer from "../search/SearchUsers";
const useStyles = makeStyles((theme: Theme) => ({
  panel: {
    paddingTop: 12,
    paddingBottom: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 10,
    borderBottom: "1px solid " + theme.palette.primary.dark,
  },
  treeName: {
    height: 40,
  },
  icon: {
    fontSize: 20,
  },
  search: {
    display: "column",
    justifyContent: "center",
  },
  button: {
    marginRight: 5,
  },
}));

const TreeInformationPanel = ({
  treeInformation,
  onTreeVisibilityChange,
  onTreeNameChange,
  onInviteUser,
  onAddNode,
  onAddMockNode,
}: any) => {
  const classes = useStyles();
  const [treeName, setTreeName] = React.useState(
    treeInformation ? treeInformation.name : ""
  );

  if (!treeInformation) return null;

  const handleTreeVisibilityChange = () => {
    onTreeVisibilityChange(treeInformation);
  };

  const handleInviteUser = (id: number) => {
    onInviteUser(id);
  };
  const canEdit = treeInformation.canEdit;

  return (
    <div className={classes.panel}>
      {canEdit && (
        <div>
          <Button
            variant="outlined"
            className={classes.button}
            onClick={() => onAddNode()}
            color="primary"
          >
            Add Node
          </Button>
          <Button
            variant="outlined"
            className={classes.button}
            onClick={() => onAddMockNode()}
          >
            Add mock Node
          </Button>
        </div>
      )}
      <TextField
        label="Tree name"
        variant="outlined"
        value={treeName}
        margin="dense"
        InputProps={{
          readOnly: !canEdit,
        }}
        onChange={(event) => {
          setTreeName(event.target.value);
        }}
        onBlur={() => {
          if (treeName !== treeInformation.name) {
            onTreeNameChange(treeInformation, treeName);
          }
        }}
        className={classes.treeName}
      />
      {canEdit && (
        <>
          <IconButton onClick={handleTreeVisibilityChange}>
            {treeInformation.isPrivate ? (
              <VisibilityOffIcon className={classes.icon} />
            ) : (
              <VisibilityIcon className={classes.icon} />
            )}
          </IconButton>

          <SearchUsersContainer onSelectUser={handleInviteUser} />
        </>
      )}
    </div>
  );
};

export default TreeInformationPanel;
