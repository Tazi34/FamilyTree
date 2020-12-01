import { makeStyles } from "@material-ui/core";
import React from "react";
import TreeContainer from "./TreeContainer";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "90%",
    margin: "0 auto",
    height: "100%",
    background: "radial-gradient(#e0e0e0,grey)",
  },
}));
const Tree = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <TreeContainer></TreeContainer>
    </div>
  );
};

export default Tree;
