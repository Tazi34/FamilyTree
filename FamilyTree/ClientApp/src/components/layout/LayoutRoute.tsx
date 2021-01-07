import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { Route } from "react-router";

type Props = {
  component: React.Component;
  layout: React.Component;
  background?: string;
} & any;
const LayoutRoute = ({
  layout: Layout,
  background,
  component: Component,
  ...otherProps
}: Props) => {
  return (
    <Route
      render={(props) => {
        return (
          <Layout background={background}>
            <Component {...props} {...otherProps} />
          </Layout>
        );
      }}
    ></Route>
  );
};

export default LayoutRoute;
