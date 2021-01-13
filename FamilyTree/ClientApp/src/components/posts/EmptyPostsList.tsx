import { Icon, makeStyles, Typography } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";

const useStyles = makeStyles((theme: Theme) => ({
  horizontalCentered: {
    marginTop: "10vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    color: "#D4D8D4",
    marginBottom: "2rem",
    flex: "auto",
    [theme.breakpoints.down("xl")]: {
      fontSize: 400,
    },
    [theme.breakpoints.down("lg")]: {
      fontSize: 300,
    },
    [theme.breakpoints.down("md")]: {
      fontSize: 200,
    },

    [theme.breakpoints.down("sm")]: {
      fontSize: 100,
    },
  },
}));

const EmptyPostsList = (props: any) => {
  const classes = useStyles();
  return (
    <div className={classes.horizontalCentered}>
      <Icon className={`fas fa-cubes ${classes.icon}`} />
      <Typography align="center" variant="h4">
        Blog is empty
      </Typography>
      {props.isOwner && (
        <Typography align="center" variant="h5">
          Save a post and it will show up here.
        </Typography>
      )}
    </div>
  );
};

export default EmptyPostsList;
