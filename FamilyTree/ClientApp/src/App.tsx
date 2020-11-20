import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import { lightGreen, lime } from "@material-ui/core/colors";
import * as React from "react";
import { Route } from "react-router";
import FriendsPanel from "./components/friendList/FriendsPanel";
import EmptyLayout from "./components/layout/EmptyLayout";
import ThreeColumnLayout from "./components/layout/ThreeColumnLayout";
import LoginPage from "./components/loginPage/LoginPage";

import Tree from "./components/tree/Tree";
import UserTreePanel from "./components/userTreeList/UserTreePanel";

export const theme = createMuiTheme({
  palette: {
    primary: lightGreen,
    secondary: lime,
  },
});

export default () => {
  const isLogged = true;
  return (
    <MuiThemeProvider theme={theme}>
      {isLogged && (
        <ThreeColumnLayout
          rightPanel={<FriendsPanel></FriendsPanel>}
          leftPanel={<UserTreePanel></UserTreePanel>}
        >
          <Route exact path="/" component={Tree} />
        </ThreeColumnLayout>
      )}
      {!isLogged && (
        <EmptyLayout>
          <Route exact path="/" component={Tree} />
          <Route path="/login" component={LoginPage} />
        </EmptyLayout>
      )}
    </MuiThemeProvider>
  );
};
