import { Route } from "react-router-dom";
import { Redirect } from "react-router";
import React, { Component } from "react";
import { User } from "./authenticationReducer";
import { LOGIN_PAGE_URI } from "../../applicationRouting";
type Props = {
  component: Component;
  user: User | null;
  requiredRoles: string[];
  layout: Component;
} & any;

export default function AuthorizedPrivateRoute({
  component: Component,
  user,
  requiredRoles,
  layout: Layout,
  ...otherProps
}: Props) {
  return (
    <Route
      render={(props) => {
        //not logged
        if (!user) {
          return (
            <Redirect
              {...otherProps}
              to={{
                pathname: LOGIN_PAGE_URI,
                state: { from: props.location.pathname },
              }}
            />
          );
        }
        if (requiredRoles) {
          const userRoles = [user.role];
          const isInRoles = userRoles.some((role) =>
            requiredRoles.includes(role)
          );
          //logged but not authorized
          if (!isInRoles) {
            return (
              <Redirect
                {...otherProps}
                to={{
                  pathname: "/",
                  state: { from: props.location },
                }}
              />
            );
          }
        }
        //authorized
        return (
          <Layout>
            <Component {...props} {...otherProps} />
          </Layout>
        );
      }}
    />
  );
}
