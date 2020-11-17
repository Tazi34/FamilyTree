import * as React from "react";
import { Route } from "react-router";
import Layout from "./components/layout/Layout";
import Home from "./components/Home";
import FetchData from "./components/FetchData";

import "./custom.css";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import { lightGreen, lime } from "@material-ui/core/colors";

export const theme = createMuiTheme({
  palette: {
    primary: lightGreen,
    secondary: lime,
  },
});

export default () => (
  <MuiThemeProvider theme={theme}>
    <Layout>
      <Route exact path="/" component={Home} />
      <Route path="/fetch-data/:startDateIndex?" component={FetchData} />
    </Layout>
  </MuiThemeProvider>
);
