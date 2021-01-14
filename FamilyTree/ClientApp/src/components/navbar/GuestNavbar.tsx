import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { LOGIN_PAGE_URI } from "../../applicationRouting";
import LoginPage from "../loginPage/UI/LoginPage";
import { RedirectButton } from "../UI/RedirectButton";

const useStyles = makeStyles((theme: Theme) => ({}));

const GuestNavbar = (props: any) => {
  const classes = useStyles();
  return (
    <div>
      <RedirectButton variant="contained" color="primary" to={LOGIN_PAGE_URI}>
        Log in
      </RedirectButton>
    </div>
  );
};

export default GuestNavbar;
