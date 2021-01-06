import {
  Avatar,
  Button,
  IconButton,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { BlogProfile } from "../../model/BlogProfile";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { formatDate } from "../../helpers/formatters";
import Skeleton from "@material-ui/lab/Skeleton";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
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
  const displayText = profile ? `${profile.name} ${profile.surname}` : "";
  const displayDate = profile ? formatDate(profile.birthday) : "28.03.1998";

  //profile?.pictureUrl;
  return (
    <Paper className={classes.profileSectionRoot}>
      <div className={classes.card}>
        <div className={classes.profilePictureContainer}>
          {profile ? (
            <Avatar className={classes.profilePicture} src={""} />
          ) : (
            <Skeleton variant="circle" width={avatarSize} height={avatarSize} />
          )}
        </div>
        <div className={classes.profileSectionContent}>
          <div className={classes.personalInformation}>
            {profile ? (
              <div>
                <Typography>{displayText}</Typography>
                <Typography>{displayDate}</Typography>
              </div>
            ) : (
              <div className={classes.infoSkeletonContainer}>
                <Skeleton variant="rect" className={classes.infoSkeleton} />
              </div>
            )}
          </div>
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
