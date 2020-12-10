import { makeStyles, Typography } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";

const useStyles = makeStyles((theme: Theme) => ({
  background: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: theme.palette.background.default,
  },
}));

const UnknownPage = (props: any) => {
  const classes = useStyles();
  return (
    <div className={classes.background}>
      <Typography variant="h3">404 Page not found</Typography>
    </div>
  );
};

export default UnknownPage;
