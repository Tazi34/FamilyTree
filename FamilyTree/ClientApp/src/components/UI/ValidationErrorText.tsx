import { makeStyles, Typography } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";

const useStyles = makeStyles((theme: Theme) => ({
  danger: {
    color: theme.palette.error.dark,
  },
}));

//TODO zamienic na wrapper
const ValidationErrorText = ({ error }: any) => {
  const classes = useStyles();

  if (!Boolean(error)) return null;
  return <Typography className={classes.danger}>{error}</Typography>;
};

export default ValidationErrorText;
