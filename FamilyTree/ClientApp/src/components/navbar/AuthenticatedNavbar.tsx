import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { BLOG_PAGE_URI } from "../../applicationRouting";
import LogoutButton from "../loginPage/LogoutButton";
import { RedirectButton } from "../UI/RedirectButton";
const useStyles = makeStyles((theme: Theme) => ({}));

const AuthenticatedNavbar = (props: any) => {
  const classes = useStyles();
  return (
    <div>
      <RedirectButton to={`${BLOG_PAGE_URI}/${props.user.id}`}>
        Blog
      </RedirectButton>

      <LogoutButton>Logout</LogoutButton>
    </div>
  );
};

export default AuthenticatedNavbar;
