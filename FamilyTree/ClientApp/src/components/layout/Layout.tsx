import {
  AppBar,
  Button,
  Container,
  Grid,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import * as React from "react";
import MenuIcon from "@material-ui/icons/Menu";
import Navbar from "../navbar/Navbar";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));
export default (props: { children?: React.ReactNode }) => {
  return (
    <React.Fragment>
      <Navbar></Navbar>
      <Grid container spacing={2}>
        <Grid item xs={4}></Grid>
        <Grid item xs={6}></Grid>
        <Grid item xs={2}></Grid>
      </Grid>
    </React.Fragment>
  );
};
