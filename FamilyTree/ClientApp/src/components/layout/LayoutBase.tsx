import { Box, makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { useSelector } from "react-redux";
import { ApplicationState } from "../../helpers/index.js";
import useBackground from "../lazyBackground/useBackground";
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
    backgroundSize: "cover",
    backgroundPosition: "35% center",
    backgroundRepeat: "no-repeat",
    opacity: 2,
    backgroundAttachment: "fixed",
    display: "flex",
    flexDirection: "column",
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

export default (props: { children?: React.ReactNode; background?: string }) => {
  const classes = useStyles();
  const authenticationState = useSelector<
    ApplicationState,
    AuthenticationState
  >((state) => state.authentication);

  useBackground({
    background: "/background.jpg",
    onLoad: () => setBackgroundLoaded(true),
  });
  const [backgroundLoaded, setBackgroundLoaded] = React.useState(false);
  const isLoggedIn = authenticationState.user != null;

  const childrenWithProps = React.Children.map(props.children, (child) => {
    // checking isValidElement is the safe way and avoids a typescript error too
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { backgroundLoaded });
    }
    return child;
  });

  return (
    <div className={classes.container}>
      <Navbar isLoggedIn={isLoggedIn} user={authenticationState.user}></Navbar>

      {/* <div className={classes.filler}></div> */}
      {childrenWithProps}
    </div>
  );
};
