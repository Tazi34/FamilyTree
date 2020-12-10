import {
  Box,
  Button,
  ButtonBase,
  Icon,
  IconButton,
  Paper,
} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import InputBase from "@material-ui/core/InputBase";
import { createStyles, fade, makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import SearchIcon from "@material-ui/icons/Search";
import { loadCSS } from "fg-loadcss";
import * as React from "react";
import { useHistory } from "react-router";
import { ApplicationName } from "../../ApplicationData";
import {
  HOME_PAGE_URI,
  BLOG_PAGE_URI,
  LOGIN_PAGE_URI,
  TREE_PAGE_URI,
} from "../../applicationRouting";
import { RedirectButton } from "../UI/RedirectButton";
import AuthenticatedNavbar from "./AuthenticatedNavbar";
import GuestNavbar from "./GuestNavbar";
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
    search: {
      borderWidth: 2,
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      "&:hover": {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto",
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    inputRoot: {
      color: "inherit",
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
    },
    logo: {
      borderRadius: "20",
      " &:focus": { outline: "none" },
    },
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
    <AppBar position="fixed">
      <Toolbar component={Paper} className={classes.toolbar}>
        <RedirectButton className={classes.logo} color="primary" to={"/"}>
          <Icon className="fas fa-tree"></Icon>
          <Typography className={classes.title} variant="h6" noWrap>
            {ApplicationName}
          </Typography>
        </RedirectButton>

        <Box border={1} borderColor="primary.main" className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Search…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ "aria-label": "search" }}
          />
        </Box>
        <div className={classes.grow} />
        <div className={classes.sectionDesktop}>
          {isLoggedIn ? <AuthenticatedNavbar user={user} /> : <GuestNavbar />}
        </div>
      </Toolbar>
    </AppBar>
  );
}
