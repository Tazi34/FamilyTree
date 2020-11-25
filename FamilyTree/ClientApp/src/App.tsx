import {
  colors,
  createMuiTheme,
  CssBaseline,
  MuiThemeProvider,
  ThemeProvider,
} from "@material-ui/core";
import { lightGreen, lime } from "@material-ui/core/colors";
import * as React from "react";
import { Route, useHistory } from "react-router";
import BlogPage from "./components/blog/BlogPage";
import FriendsPanel from "./components/friendList/FriendsPanel";
import EmptyLayout from "./components/layout/EmptyLayout";
import ThreeColumnLayout from "./components/layout/ThreeColumnLayout";
import LoginPage from "./components/loginPage/LoginPage";
import { Theme } from "@material-ui/core/styles";
import Tree from "./components/tree/Tree";
import UserTreePanel from "./components/userTreeList/UserTreePanel";
import HomePage from "./components/homePage/HomePage";
import {
  BLOG_PAGE_URI,
  HOME_PAGE_URI,
  LOGIN_PAGE_URI,
  TREE_PAGE_URI,
} from "./applicationRouting";

export const theme = createMuiTheme({
  palette: {
    primary: lightGreen,
    secondary: lime,
  },
});

const loggedInURIs = [TREE_PAGE_URI, BLOG_PAGE_URI];
const notLoggedInURIs = [HOME_PAGE_URI, LOGIN_PAGE_URI];

export default () => {
  const history = useHistory();
  const isLogged = loggedInURIs.includes(history.location.pathname);
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {isLogged && (
        <ThreeColumnLayout
          rightPanel={<FriendsPanel></FriendsPanel>}
          leftPanel={<UserTreePanel></UserTreePanel>}
        >
          <Route exact path="/tree" component={Tree} />
          <Route exact path="/blog" component={BlogPage} />
        </ThreeColumnLayout>
      )}
      {!isLogged && (
        <EmptyLayout>
          <Route exact path="/tree" component={Tree} />
          <Route exact path="/" component={HomePage} />
          <Route path="/login" component={LoginPage} />
        </EmptyLayout>
      )}
    </MuiThemeProvider>
  );
};
