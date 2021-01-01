import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";

const useStyles = makeStyles((theme: Theme) => ({
  main: {
    minHeight: "100%",
    margin: "0 auto",
    height: 1,
    [theme.breakpoints.up("md")]: {
      width: "80%",
    },
    [theme.breakpoints.up("lg")]: {
      width: "75%",
    },
    [theme.breakpoints.up("xl")]: {
      width: "60%",
    },
    [theme.breakpoints.down("sm")]: {
      width: "90%",
    },
  },
}));

type Props = {
  children: any;
};
const ResponsiveMainColumn = ({ children }: Props) => {
  const classes = useStyles();
  return <div className={classes.main}>{children}</div>;
};

export default ResponsiveMainColumn;
