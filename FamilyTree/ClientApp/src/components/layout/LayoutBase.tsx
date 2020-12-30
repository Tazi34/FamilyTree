import { Box, makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { useSelector } from "react-redux";
import { ApplicationState } from "../../helpers/index.js";
import { AuthenticationState } from "../loginPage/authenticationReducer.js";
import Navbar from "../navbar/Navbar.jsx";

const useStyles = makeStyles((theme: Theme) => ({
  lightBackground: {
    flex: 1,
    background: theme.palette.primary.light,
  },
  darkBackground: {
    flex: 0,
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
  },
  filler: {
    width: "100%",
    marginTop: 64,
  },
}));

export interface LayoutPanelProperties {
  component: React.ReactNode;
  flex: number;
}

export default (props: { children?: React.ReactNode }) => {
  const classes = useStyles();
  const authenticationState = useSelector<
    ApplicationState,
    AuthenticationState
  >((state) => state.authentication);

  const isLoggedIn = authenticationState.user != null;
  return (
    <Box
      display="flex"
      className={classes.container}
      flexDirection="column"
      alignItems="stretch"
    >
      <Navbar isLoggedIn={isLoggedIn} user={authenticationState.user}></Navbar>

      {/* <div className={classes.filler}></div> */}
      {props.children}
    </Box>
  );
};
