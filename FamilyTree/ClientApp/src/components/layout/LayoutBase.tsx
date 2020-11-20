import { Box, makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import Navbar from "../navbar/Navbar.jsx";

const useStyles = makeStyles((theme: Theme) => ({
  lightBackground: {
    flex: 0.85,
    background: theme.palette.primary.light,
  },
  darkBackground: {
    flex: 0.15,
    background: theme.palette.primary.dark,
  },
  backgroundContainer: {
    height: "100%",
    zIndex: -100,
    position: "absolute",
    width: "100%",
  },
  container: {
    height: "100%",
  },
  grid: { height: "100%" },
  column: {
    maring: 0,
    padding: 0,
  },
  mainPanel: {
    height: "100%",
    background: "#f4f4f4",
  },
}));

export interface LayoutPanelProperties {
  component: React.ReactNode;
  flex: number;
}

export default (props: { children?: React.ReactNode }) => {
  const classes = useStyles();
  return (
    <Box
      display="flex"
      className={classes.container}
      flexDirection="column"
      alignItems="stretch"
    >
      <Navbar></Navbar>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="stretch"
        className={classes.backgroundContainer}
      >
        <div className={classes.lightBackground}></div>
        <div className={classes.darkBackground}></div>
      </Box>
      {props.children}
    </Box>
  );
};