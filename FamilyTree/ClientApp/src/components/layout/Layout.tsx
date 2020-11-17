import { Grid, makeStyles } from "@material-ui/core";
import * as React from "react";
import Navbar from "../navbar/Navbar.jsx";

const useStyles = makeStyles((theme) => ({
  test: {
    border: "3px solid red",
    color: "red",
    height: 1000,
  },
}));
export default (props: { children?: React.ReactNode }) => {
  const classes2 = useStyles();
  return (
    <React.Fragment>
      <Navbar></Navbar>
      <Grid container spacing={2}>
        <Grid item xs={3} className={classes2.test}></Grid>
        <Grid item xs={7} className={classes2.test}></Grid>
        <Grid item xs={2} className={classes2.test}></Grid>
      </Grid>
    </React.Fragment>
  );
};
