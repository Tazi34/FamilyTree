import { useDispatch } from "react-redux";
import { Redirect } from "react-router";
import { logoutUser } from "../authenticationReducer";
import * as React from "react";
import { LOGIN_PAGE_URI } from "../../../applicationRouting";
export const Logout = (...props: any) => {
  const dispatch = useDispatch();
  const linkTarget = {
    pathname: LOGIN_PAGE_URI,
    key: Math.random(),
    state: {
      applied: true,
    },
  };
  dispatch(logoutUser());
  return <Redirect to={linkTarget} push={true} {...props} />;
};
