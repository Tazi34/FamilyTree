import {
  BLOG_PAGE_URI,
  HOME_PAGE_URI,
  TREE_PAGE_URI,
  LOGIN_PAGE_URI,
} from "../../applicationRouting";
import { RedirectButton } from "../UI/RedirectButton";
import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import LogoutButton from "../loginPage/LogoutButton";
const useStyles = makeStyles((theme: Theme) => ({}));

const AuthenticatedNavbar = (props: any) => {
  const classes = useStyles();
  return (
    <div>
      <RedirectButton to={BLOG_PAGE_URI}>Blog</RedirectButton>
      <RedirectButton to={TREE_PAGE_URI}>Tree</RedirectButton>
      <RedirectButton to={TREE_PAGE_URI}>Tree</RedirectButton>
      <LogoutButton>Logout</LogoutButton>
    </div>
  );
};

export default AuthenticatedNavbar;
