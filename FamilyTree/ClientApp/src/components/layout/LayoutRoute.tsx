import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { Route } from "react-router";

type Props = {
  component: React.Component;
  layout: React.Component;
} & any;
const LayoutRoute = ({
  layout: Layout,
  component: Component,
  ...otherProps
}: Props) => {
  return (
    <Route
      render={(props) => {
        return (
          <Layout>
            <Component {...props} {...otherProps} />
          </Layout>
        );
      }}
    ></Route>
  );
};

export default LayoutRoute;
