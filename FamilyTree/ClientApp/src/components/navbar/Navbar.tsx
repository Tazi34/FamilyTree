import { Avatar, Chip, Icon, Paper } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import { createStyles, fade, makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { loadCSS } from "fg-loadcss";
import * as React from "react";
import { useHistory } from "react-router";
import { ApplicationName } from "../../ApplicationData";
import { BLOG_PAGE_URI, LOGIN_PAGE_URI } from "../../applicationRouting";
import { User } from "../loginPage/authenticationReducer";
import LogoutButton from "../loginPage/LogoutButton";
import MainSearchContainer from "../search/MainSearchContainer";
import { RedirectButton } from "../UI/RedirectButton";
import TooltipMouseFollow from "../UI/TooltipMouseFollow";
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
    avatar: {
      marginLeft: 5,
    },
  })
);
type Props = {
  user: User | null;
};
export default function PrimarySearchAppBar({ user }: Props) {
  const classes = useStyles();
  const isLoggedIn = Boolean(user);
  React.useEffect(() => {
    const node = loadCSS(
      "https://use.fontawesome.com/releases/v5.12.0/css/all.css",
      document.querySelector("#font-awesome-css") as any
    );

    return () => {
      if (node) node?.parentNode?.removeChild(node);
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
              to={`${BLOG_PAGE_URI}/${user!.id}`}
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
        {user && (
          <TooltipMouseFollow title={`${user.name} ${user.surname}`}>
            <Avatar
              className={classes.avatar}
              alt={`${user.name} ${user.surname}`}
              src={user.pictureUrl}
            />
          </TooltipMouseFollow>
        )}
      </Toolbar>
    </AppBar>
  );
}
