import { IconButton, makeStyles, Paper } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import * as React from "react";
import { formatDate } from "../../helpers/formatters";
import { BlogProfile } from "../../model/BlogProfile";
import UserProfilePreview from "../userProfile/UserProfilePreview";
const avatarSize = 50;
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
  profilePicture: {
    width: avatarSize,
    height: avatarSize,
  },
  defaultProfileIcon: {
    fontSize: 84,
  },
  personalInformation: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  rightActions: {},
  filler: {
    flexGrow: 1,
  },
  title: {
    width: "100%",
  },
  infoSkeleton: {
    height: "100%",
  },
  infoSkeletonContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    width: "100%",
    height: "100%",
  },
  messageButton: {},
  messageButtonContainer: {
    marginLeft: 5,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
}));
type Props = {
  profile: BlogProfile | null;
  onContact: () => void;
};
const BlogProfileSection = ({ profile, onContact }: Props) => {
  const classes = useStyles();

  return (
    <Paper className={classes.profileSectionRoot}>
      <div className={classes.card}>
        <UserProfilePreview profile={profile} imgSize={avatarSize} />
        <div className={classes.profileSectionContent}>
          <div className={classes.filler} />
          <div className={classes.messageButtonContainer}>
            <IconButton className={classes.messageButton} onClick={onContact}>
              <MailOutlineIcon />
            </IconButton>
          </div>
        </div>
      </div>
    </Paper>
  );
};

export default BlogProfileSection;
