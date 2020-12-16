import { IconButton, makeStyles, TextField } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import React, { useState } from "react";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
const useStyles = makeStyles((theme: Theme) => ({
  panel: {
    background: "White",
    maxWidth: 500,
    display: "flex",
    alignItems: "center",
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
  },
  treeName: {
    flexGrow: 1,
    outline: "none",
    border: 0,
    "&:focus": {
      outline: "none",
    },
  },
  icon: {
    fontSize: 20,
  },
}));

const TreeInformationPanel = ({
  treeInformation,
  onTreeVisibilityChange,
  onTreeNameChange,
}: any) => {
  const classes = useStyles();
  const [treeName, setTreeName] = React.useState(
    treeInformation ? treeInformation.name : ""
  );

  if (!treeInformation) return null;

  const handleTreeVisibilityChange = () => {
    onTreeVisibilityChange(treeInformation);
  };

  return (
    <div className={classes.panel}>
      <IconButton onClick={handleTreeVisibilityChange}>
        {treeInformation.isPrivate ? (
          <VisibilityOffIcon className={classes.icon} />
        ) : (
          <VisibilityIcon className={classes.icon} />
        )}
      </IconButton>
      <input
        value={treeName}
        onChange={(event) => {
          setTreeName(event.target.value);
        }}
        onBlur={() => {
          if (treeName !== treeInformation.name) {
            onTreeNameChange(treeInformation, treeName);
          }
        }}
        className={classes.treeName}
        defaultValue={treeInformation.name}
      ></input>
    </div>
  );
};

export default TreeInformationPanel;
