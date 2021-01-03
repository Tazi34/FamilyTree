import {
  Avatar,
  IconButton,
  makeStyles,
  Paper,
  TextField,
} from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import SettingsIcon from "@material-ui/icons/Settings";
import * as React from "react";
import { User } from "../loginPage/authenticationReducer";

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
    marginRight: 10,
    marginLeft: 10,
  },
  profilePicture: {
    height: 50,
    width: 50,
  },
  buttonContainer: {
    padding: 0,
    alignSelf: "start",
  },
}));
type Props = {
  redirectToPostForm: () => void;
  onEditProfile: () => void;
  user: User;
};
const BlogOwnerSection = ({
  redirectToPostForm,
  onEditProfile,
  user,
}: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.profilePictureContainer}>
        <Avatar src={user.pictureUrl} className={classes.profilePicture} />
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
      <IconButton className={classes.buttonContainer} onClick={onEditProfile}>
        <SettingsIcon />
      </IconButton>
    </div>
  );
};

export default BlogOwnerSection;
