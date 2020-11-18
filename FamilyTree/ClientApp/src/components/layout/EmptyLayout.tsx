import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import LayoutBase from "./LayoutBase";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: "100%",
    width: "100%",
  },
}));
export default (props: { children?: React.ReactNode }) => {
  const classes = useStyles();
  return (
    <LayoutBase>
      <div className={classes.root}>{props.children}</div>
    </LayoutBase>
  );
};
