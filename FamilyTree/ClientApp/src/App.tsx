import * as React from "react";
import { Route } from "react-router";
import ThreeColumnLayout from "./components/layout/ThreeColumnLayout";
import Home from "./components/Home";
import FetchData from "./components/FetchData";

import "./custom.css";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import { lightGreen, lime } from "@material-ui/core/colors";
import FriendsPanel from "./components/friendList/FriendsPanel";
import UserTreePanel from "./components/userTreeList/UserTreePanel";
import LoginPage from "./components/loginPage/LoginPage";
import EmptyLayout from "./components/layout/EmptyLayout";
import HomePage from "./components/homePage/HomePage";

export const theme = createMuiTheme({
  palette: {
    primary: lightGreen,
    secondary: lime,
  },
});

export default () => {
  const isLogged = false;
  return (
    <MuiThemeProvider theme={theme}>
      {isLogged && (
        <ThreeColumnLayout
          rightPanel={<FriendsPanel></FriendsPanel>}
          leftPanel={<UserTreePanel></UserTreePanel>}
        >
          <Route exact path="/tree" component={Home} />
          <Route path="/fetch-data/:startDateIndex?" component={FetchData} />
        </ThreeColumnLayout>
      )}
      {!isLogged && (
        <EmptyLayout>
          <Route exact path="/" component={HomePage} />
          <Route path="/login" component={LoginPage} />
        </EmptyLayout>
      )}
    </MuiThemeProvider>
  );
};
