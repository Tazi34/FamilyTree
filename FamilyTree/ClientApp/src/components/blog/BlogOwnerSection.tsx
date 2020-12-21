import {
  Box,
  IconButton,
  makeStyles,
  Paper,
  TextField,
} from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import SettingsIcon from "@material-ui/icons/Settings";
import { Post } from "../../model/Post";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: 10,
    display: "flex",
    alignItems: "stretch",
  },
  column: {
    margin: 10,
  },

  profilePictureContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  profilePicture: {
    fontSize: 40,
  },
}));
type Props = {
  redirectToPostForm: () => void;
  onEditProfile: () => void;
};
const BlogOwnerSection = ({ redirectToPostForm, onEditProfile }: Props) => {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <div className={classes.profilePictureContainer}>
        <AccountCircleIcon
          className={classes.profilePicture}
        ></AccountCircleIcon>
      </div>
      <TextField
        className={classes.column}
        multiline
        rows={2}
        id="postCreatorInput"
        label="What would you want to share?"
        fullWidth
        onClick={redirectToPostForm}
      />
      <IconButton onClick={onEditProfile}>
        <SettingsIcon />
      </IconButton>
    </Paper>
  );
};

export default BlogOwnerSection;
