import {
  Avatar,
  IconButton,
  makeStyles,
  Paper,
  TextField,
  Tooltip,
} from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import SettingsIcon from "@material-ui/icons/Settings";
import * as React from "react";
import { User } from "../loginPage/authenticationReducer";
import TooltipMouseFollow from "../UI/TooltipMouseFollow";

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
    padding: 5,
  },
  profilePicture: {
    width: 60,
    height: 60,
    border: "1px solid rgba(0, 0, 0, 0.42)",
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

  const picture = Boolean(user?.pictureUrl?.endsWith("person_icon.png"))
    ? ""
    : user.pictureUrl;
  return (
    <div className={classes.root}>
      <div className={classes.profilePictureContainer}>
        <TooltipMouseFollow
          title={`${user.name} ${user.surname}`}
          placement="top"
        >
          <Avatar
            variant="circular"
            src={picture}
            className={classes.profilePicture}
          >
            {user.name[0]}
            {user.surname[0]}
          </Avatar>
        </TooltipMouseFollow>
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
