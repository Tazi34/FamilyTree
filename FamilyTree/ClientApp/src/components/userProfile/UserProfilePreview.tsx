import { Avatar, IconButton, makeStyles, Typography } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import Skeleton from "@material-ui/lab/Skeleton";
import { format } from "date-fns";
import * as React from "react";
import { formatDate } from "../../helpers/formatters";
import { Profile } from "../../model/Profile";

const defaultImageSize = 100;
const useStyles = makeStyles<any, any>((theme: Theme) => ({
  profileEditorRoot: {
    width: "100%",
    height: "100%",
    padding: 40,
  },
  editPictureIconContainer: {
    zIndex: 100000,
    position: "absolute",
    right: 5,
    bottom: 5,
    padding: 7,
  },
  editPictureIcon: {
    fontSize: 17,
  },
  title: {
    marginBottom: 15,
  },
  profilePreview: {
    width: "100%",
    display: "flex",
    alignItems: "center",
  },
  pictureContainer: {
    width: ({ imgSize }) => imgSize,
    height: ({ imgSize }) => imgSize,
    cursor: ({ clickable }) => (clickable ? "pointer" : "default"),
    marginRight: 30,
    position: "relative",
  },
  picture: {
    height: "100%",
  },
  previewContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  formContainer: {
    marginTop: 50,
  },
  submitButton: {
    marginRight: 8,
  },
  genderIcon: {},
  textSkeleton: {
    width: 200,
    height: "100%",
  },
}));
type Props = {
  profile: Profile | null;
  onClick?: Function;
  imgSize?: number;
};
const UserProfilePreview = ({ profile, onClick, imgSize }: Props) => {
  const clickable = Boolean(onClick);
  const classes = useStyles({
    clickable,
    imgSize: imgSize ?? defaultImageSize,
  });
  const genderIcon = profile
    ? profile.sex === "Male"
      ? "fas fa-mars"
      : profile.sex === "Female"
      ? "fas fa-venus"
      : null
    : null;
  const displayName = profile ? `${profile?.name} ${profile?.surname}` : "";
  const displayDate = formatDate(profile?.birthday);

  const handleClick = () => {
    if (onClick) onClick();
  };
  return (
    <div className={classes.profilePreview}>
      {profile && (
        <div className={classes.pictureContainer} onClick={handleClick}>
          {clickable && (
            <IconButton className={classes.editPictureIconContainer}>
              <i className={`fas fa-camera ${classes.editPictureIcon}`} />
            </IconButton>
          )}

          <Avatar
            className={classes.pictureContainer}
            alt={displayName}
            sizes={"(min-width: 40em) 80vw, 100vw"}
            src={profile?.pictureUrl}
          />
        </div>
      )}
      {!profile && (
        <Skeleton
          variant="circle"
          className={classes.pictureContainer}
        ></Skeleton>
      )}
      {!profile && (
        <Skeleton className={classes.textSkeleton} variant="text"></Skeleton>
      )}
      {profile && (
        <div>
          <Typography variant="h5">{displayName}</Typography>
          <Typography variant="body1">{displayDate}</Typography>
          {genderIcon && (
            <i className={`${genderIcon} ${classes.genderIcon}`} />
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfilePreview;
