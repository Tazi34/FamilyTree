import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router";
import { isLoggedIn } from "../loginPage/authenticationReducer";

const GuestRoute = ({
  to,
  layout: Layout,
  component: Component,
  ...otherProps
}: any) => {
  const loggedIn = useSelector(isLoggedIn);

  return (
    <Route
      render={(props) => {
        //not logged
        if (loggedIn) {
          return (
            <Redirect
              {...otherProps}
              to={{
                pathname: "/",
                state: { from: props.location.pathname },
              }}
            />
          );
        }
        return (
          <Layout>
            <Component {...props} {...otherProps} />
          </Layout>
        );
      }}
    />
  );
};

export default GuestRoute;
