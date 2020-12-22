import DateFnsUtils from "@date-io/date-fns";
import {
  createMuiTheme,
  CssBaseline,
  MuiThemeProvider,
} from "@material-ui/core";
import { lightGreen, lime } from "@material-ui/core/colors";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Route, Switch } from "react-router-dom";
import {
  BLOG_PAGE_URI,
  HOME_PAGE_URI,
  LOGIN_PAGE_URI,
  LOGOUT_PAGE_URI,
  CREATE_POST_FORM_PAGE_URI,
  REGISTER_PAGE_URI,
  TREE_PAGE_URI,
  EDIT_POST_FORM_PAGE_URI,
  PROFILE_PAGE_URI,
} from "./applicationRouting";
import { withAlertMessage } from "./components/alerts/withAlert";
import BlogPage from "./components/blog/BlogPage";
import HomePage from "./components/homePage/HomePage";
import EmptyLayout from "./components/layout/EmptyLayout";
import LayoutRoute from "./components/layout/LayoutRoute";
import ThreeColumnLayout from "./components/layout/ThreeColumnLayout";
import { Logout } from "./components/loginPage/API/Logout";
import {
  AuthenticationState,
  getUser,
} from "./components/loginPage/authenticationReducer";
import AuthorizedPrivateRoute from "./components/loginPage/AuthorizedPrivateRoute";
import LoginPage from "./components/loginPage/UI/LoginPage";
import GuestRoute from "./components/navigation/GuestRoute";
import UnknownPage from "./components/navigation/UnknownPage";
import CreatePostFormContainer from "./components/postForm/CreatePostFormContainer";
import EditPostFormContainer from "./components/postForm/EditPostFormContainer";
import PostForm from "./components/postForm/PostForm";
import Registration from "./components/registration/Registration";
import Tree from "./components/tree/Tree";
import UserProfileContainer from "./components/userProfile/UserProfileContainer";

import { ApplicationState } from "./helpers";

export const theme = createMuiTheme({
  palette: {
    primary: lightGreen,
    secondary: lime,
  },
  overrides: {
    MuiButtonBase: {
      root: {
        "&:focus": {
          outline: "none",
        },
      },
    },
  },
});

const App = (props: any) => {
  const isVerifyingUser = useSelector<ApplicationState, boolean>(
    (state) => state.authentication.status.loading
  );
  const loggedUser = useSelector(getUser);

  if (isVerifyingUser) {
    return null;
  }

  const { alertSuccess, alertError, alertInfo } = props;

  return (
    <MuiThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <CssBaseline />

        <Switch>
          <AuthorizedPrivateRoute
            path={`${TREE_PAGE_URI}/:treeId`}
            component={Tree}
            layout={ThreeColumnLayout}
            user={loggedUser}
          />
          <AuthorizedPrivateRoute
            exact
            path={`${BLOG_PAGE_URI}/:blogId`}
            component={BlogPage}
            layout={ThreeColumnLayout}
            user={loggedUser}
          />
          <AuthorizedPrivateRoute
            exact
            path={`${PROFILE_PAGE_URI}`}
            onSuccess={alertSuccess}
            onError={alertError}
            component={UserProfileContainer}
            layout={ThreeColumnLayout}
            user={loggedUser}
          />
          <AuthorizedPrivateRoute
            exact
            path={CREATE_POST_FORM_PAGE_URI}
            component={CreatePostFormContainer}
            layout={ThreeColumnLayout}
            user={loggedUser}
          />
          <AuthorizedPrivateRoute
            exact
            path={`${EDIT_POST_FORM_PAGE_URI}/:postId`}
            component={EditPostFormContainer}
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
          <LayoutRoute
            exact
            path="*"
            component={UnknownPage}
            layout={EmptyLayout}
          />
        </Switch>
      </MuiPickersUtilsProvider>
    </MuiThemeProvider>
  );
};

export default withAlertMessage(App);
