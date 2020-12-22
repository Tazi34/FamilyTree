import { Button, makeStyles, Paper, Typography } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { BlogProfile } from "../../model/BlogProfile";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

const useStyles = makeStyles((theme: Theme) => ({
  profileSectionRoot: {
    width: "100%",
    height: 100,
    padding: 8,

    display: "flex",
    flexDirection: "column",
  },
  card: {
    display: "flex",
    height: "100%",
  },
  profilePictureContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  profileSectionContent: {
    marginLeft: 15,
    flexGrow: 1,

    display: "flex",
    flexDirection: "row",
  },
  profilePicture: {},
  defaultProfileIcon: {
    fontSize: 84,
  },
  personalInformation: {
    display: "flex",
    flexDirection: "column",
  },
  rightActions: {},
  filler: {
    flexGrow: 1,
  },
  title: {
    width: "100%",
  },
}));
type Props = {
  profile: BlogProfile;
  onContact: () => void;
};
const BlogProfileSection = ({ profile, onContact }: Props) => {
  const classes = useStyles();
  const hasPicture = Boolean(profile?.pictureUrl);
  return (
    <Paper className={classes.profileSectionRoot}>
      <div className={classes.card}>
        <div className={classes.profilePictureContainer}>
          {hasPicture ? (
            <img src={profile.pictureUrl} className={classes.profilePicture} />
          ) : (
            <AccountCircleIcon
              className={classes.defaultProfileIcon}
            ></AccountCircleIcon>
          )}
        </div>
        <div className={classes.profileSectionContent}>
          <div className={classes.personalInformation}>
            <Typography>
              {profile.name} {profile.surname}
            </Typography>
            <Typography>28.03.1998</Typography>
          </div>
          <div className={classes.filler} />
          <Button color="primary">Trees</Button>
          <Button color="primary" onClick={onContact}>
            Contact
          </Button>
        </div>
      </div>
    </Paper>
  );
};

export default BlogProfileSection;
