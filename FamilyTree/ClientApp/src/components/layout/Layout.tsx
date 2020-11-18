import { Box, Grid, makeStyles } from "@material-ui/core";
import * as React from "react";
import Navbar from "../navbar/Navbar.jsx";
import { Theme, withTheme } from "@material-ui/core/styles";
import UserTreePanel from "../userTreeList/UserTreePanel";
import FriendsPanel from "../friendList/FriendsPanel";

const useStyles = makeStyles((theme: Theme) => ({
  lightBackground: {
    flex: 0.75,
    background: theme.palette.primary.light,
  },
  darkBackground: {
    flex: 0.25,
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
const Layout = (props: { children?: React.ReactNode; theme: Theme }) => {
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
      <Grid container direction="row" className={classes.grid} justify="center">
        <Grid item xs={2} className={classes.column}>
          <UserTreePanel></UserTreePanel>
        </Grid>
        <Grid item xs={9} className={classes.column}>
          <div className={classes.mainPanel}></div>
        </Grid>
        <Grid item xs={1} className={classes.column}>
          <FriendsPanel></FriendsPanel>
        </Grid>
      </Grid>
    </Box>
  );
};

export default withTheme(Layout);
