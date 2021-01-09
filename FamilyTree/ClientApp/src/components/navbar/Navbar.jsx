import { Icon, Paper } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import { createStyles, fade, makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { loadCSS } from "fg-loadcss";
import * as React from "react";
import { useHistory } from "react-router";
import { ApplicationName } from "../../ApplicationData";
import { BLOG_PAGE_URI, LOGIN_PAGE_URI } from "../../applicationRouting";
import LogoutButton from "../loginPage/LogoutButton";
import MainSearchContainer from "../search/MainSearchContainer";
import { RedirectButton } from "../UI/RedirectButton";
const useStyles = makeStyles((theme) =>
  createStyles({
    grow: {
      flexGrow: 1,
    },
    title: {
      display: "none",
      [theme.breakpoints.up("sm")]: {
        display: "block",
      },
    },
    navbarButton: {
      width: 80,
      marginLeft: 8,
    },
    inputRoot: {
      color: "inherit",
    },
    logoIcon: {
      fontSize: 23,
      marginRight: 5,
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: "20ch",
      },
    },
    sectionDesktop: {
      display: "flex",
    },
    toolbar: {
      borderRadius: 0,
      display: "flex",
      justifyContent: "center",
    },
    barContainer: {
      position: "sticky",
      top: 0,
    },
    logo: { marginRight: 8 },
  })
);
export default function PrimarySearchAppBar({ isLoggedIn, user }) {
  const classes = useStyles();
  const history = useHistory();
  React.useEffect(() => {
    const node = loadCSS(
      "https://use.fontawesome.com/releases/v5.12.0/css/all.css",
      document.querySelector("#font-awesome-css")
    );

    return () => {
      node.parentNode.removeChild(node);
    };
  }, []);

  return (
    <AppBar position="sticky" className={classes.barContainer}>
      <Toolbar component={Paper} className={classes.toolbar}>
        <RedirectButton className={classes.logo} color="primary" to={"/"}>
          <i className={"fas fa-leaf " + classes.logoIcon}></i>
          <Typography className={classes.title} variant="h6" noWrap>
            {ApplicationName}
          </Typography>
        </RedirectButton>
        <MainSearchContainer />
        {isLoggedIn && (
          <div className={classes.sectionDesktop}>
            <RedirectButton
              className={classes.navbarButton}
              to={`${BLOG_PAGE_URI}/${user.id}`}
            >
              Home
            </RedirectButton>

            <LogoutButton className={classes.navbarButton}>Logout</LogoutButton>
          </div>
        )}
        {!isLoggedIn && (
          <div className={classes.sectionDesktop}>
            <RedirectButton
              className={classes.navbarButton}
              variant="contained"
              color="primary"
              to={LOGIN_PAGE_URI}
            >
              Log in
            </RedirectButton>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
}
