import { useDispatch } from "react-redux";
import { Redirect } from "react-router";
import { logoutUser } from "../authenticationReducer";
import * as React from "react";
import { LOGIN_PAGE_URI } from "../../../applicationRouting";
import useAlert from "../../alerts/useAlert";
export const Logout = (...props: any) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const linkTarget = {
    pathname: LOGIN_PAGE_URI,
    key: Math.random(),
    state: {
      applied: true,
    },
  };
  dispatch(logoutUser());
  alert.success("You have been logged out.");
  return <Redirect to={linkTarget} push={true} {...props} />;
};
