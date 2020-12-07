import DateFnsUtils from "@date-io/date-fns";
import {
  createMuiTheme,
  CssBaseline,
  MuiThemeProvider,
} from "@material-ui/core";
import { lightGreen, lime } from "@material-ui/core/colors";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import * as React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Route, Switch } from "react-router-dom";
import {
  BLOG_PAGE_URI,
  HOME_PAGE_URI,
  LOGIN_PAGE_URI,
  LOGOUT_PAGE_URI,
  REGISTER_PAGE_URI,
  TREE_PAGE_URI,
} from "./applicationRouting";
import { withAlertMessage } from "./components/alerts/withAlert";
import BlogPage from "./components/blog/BlogPage";
import Suntech from "./components/chat/Suntech";
import HomePage from "./components/homePage/HomePage";
import EmptyLayout from "./components/layout/EmptyLayout";
import LayoutRoute from "./components/layout/LayoutRoute";
import ThreeColumnLayout from "./components/layout/ThreeColumnLayout";
import { Logout } from "./components/loginPage/API/Logout";
import { AuthenticationState } from "./components/loginPage/authenticationReducer";
import AuthorizedPrivateRoute from "./components/loginPage/AuthorizedPrivateRoute";
import LoginPage from "./components/loginPage/UI/LoginPage";
import GuestRoute from "./components/navigation/GuestRoute";
import Registration from "./components/registration/Registration";
import Tree from "./components/tree/Tree";
import { ApplicationState } from "./helpers";

export const theme = createMuiTheme({
  palette: {
    primary: lightGreen,
    secondary: lime,
  },
});

const App = (props: any) => {
  const authenticationState = useSelector<
    ApplicationState,
    AuthenticationState
  >((state) => state.authentication);
  const loggedUser = authenticationState.user;
  const isVerifyingUser = authenticationState.status.loading;

  if (loggedUser && isVerifyingUser) {
    return null;
  }
  const { alertSuccess, alertError, alertInfo } = props;

  return <Suntech />;

  return (
    <MuiThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <CssBaseline />

        <Switch>
          <AuthorizedPrivateRoute
            path={TREE_PAGE_URI}
            component={Tree}
            layout={ThreeColumnLayout}
            user={loggedUser}
          />
          <AuthorizedPrivateRoute
            path={BLOG_PAGE_URI}
            component={BlogPage}
            layout={ThreeColumnLayout}
            user={loggedUser}
          />
          <LayoutRoute
            path={LOGIN_PAGE_URI}
            component={LoginPage}
            layout={EmptyLayout}
            onSuccess={alertSuccess}
            onError={alertError}
            user={loggedUser}
          />
          <GuestRoute
            path={REGISTER_PAGE_URI}
            component={Registration}
            onSuccess={alertSuccess}
            onError={alertError}
            layout={EmptyLayout}
          />
          <Route path={LOGOUT_PAGE_URI} component={Logout} />
          <LayoutRoute
            exact
            path="/"
            component={HomePage}
            layout={EmptyLayout}
          />
        </Switch>
      </MuiPickersUtilsProvider>
    </MuiThemeProvider>
  );
};

export default withAlertMessage(App);
