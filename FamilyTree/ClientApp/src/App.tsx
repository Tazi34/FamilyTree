import DateFnsUtils from "@date-io/date-fns";
import {
  createMuiTheme,
  CssBaseline,
  MuiThemeProvider,
} from "@material-ui/core";
import { lightGreen, lime, red } from "@material-ui/core/colors";
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
  PRIVACY_POLICY_PAGE_URI,
  POST_PAGE_URI,
} from "./applicationRouting";
import { withAlertMessage } from "./components/alerts/withAlert";
import BlogPage from "./components/blog/BlogPage";
import HomePage from "./components/homePage/HomePage";
import LayoutRoute from "./components/layout/LayoutRoute";
import EmptyLayout from "./components/layout/EmptyLayout";
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
import UserProfileDialog from "./components/userProfile/UserProfileDialog";

import { ApplicationState } from "./helpers";
import PrivacyPolicyPage from "./components/privacy/PrivacyPolicyPage";
import ThreeColumnLayout from "./components/layout/ThreeColumnLayout";
import { useThunkDispatch } from ".";
import { getInvitations } from "./components/invitation/reducer/invitationsReducer";
import CreateTreeNodeDialog from "./components/addNodeActionDialog/CreateTreeNodeDialog";
import LayoutBase from "./components/layout/LayoutBase";
import useBackground from "./components/lazyBackground/useBackground";
import BlogPostPage from "./components/posts/BlogPostPage";
import GlobalAlerts from "./components/alerts/GlobalAlerts";
import useAlert from "./components/alerts/useAlert";

export const theme = createMuiTheme({
  palette: {
    // primary: {
    //   main: lightGreen[600],
    //   light: lightGreen[200],
    //   dark: lightGreen[800],
    // },
    // background: {
    //   default: lightGreen[200],
    // },

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
  const history = useHistory();
  const dispatch = useThunkDispatch();

  if (loggedUser) {
    dispatch(getInvitations());
  }

  React.useEffect(() => {
    history.listen(() => {
      if (loggedUser) {
        dispatch(getInvitations());
      }
    });
  }, [history]);

  if (isVerifyingUser) {
    return null;
  }

  return (
    <MuiThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <CssBaseline />

        <Switch>
          <AuthorizedPrivateRoute
            requiredRoles={["GUEST"]}
            path={`${TREE_PAGE_URI}/:treeId`}
            component={Tree}
            layout={LayoutBase}
            user={loggedUser}
          />
          <AuthorizedPrivateRoute
            exact
            path={`${BLOG_PAGE_URI}/:blogId`}
            component={BlogPage}
            layout={LayoutBase}
            user={loggedUser}
          />
          <AuthorizedPrivateRoute
            exact
            path={`${PROFILE_PAGE_URI}`}
            component={UserProfileDialog}
            layout={EmptyLayout}
            user={loggedUser}
          />
          <AuthorizedPrivateRoute
            exact
            path={CREATE_POST_FORM_PAGE_URI}
            component={CreatePostFormContainer}
            layout={EmptyLayout}
            user={loggedUser}
          />
          <AuthorizedPrivateRoute
            exact
            path={`${EDIT_POST_FORM_PAGE_URI}/:postId`}
            component={EditPostFormContainer}
            layout={EmptyLayout}
            user={loggedUser}
          />
          <AuthorizedPrivateRoute
            exact
            path={CREATE_POST_FORM_PAGE_URI}
            component={CreatePostFormContainer}
            layout={ThreeColumnLayout}
            user={loggedUser}
          />

          <LayoutRoute
            path={LOGIN_PAGE_URI}
            component={LoginPage}
            layout={LayoutBase}
            user={loggedUser}
            background={"/background.jpg"}
          />
          <GuestRoute
            path={REGISTER_PAGE_URI}
            component={Registration}
            layout={EmptyLayout}
          />
          <LayoutRoute
            path={PRIVACY_POLICY_PAGE_URI}
            component={PrivacyPolicyPage}
            layout={EmptyLayout}
          />
          <Route path={LOGOUT_PAGE_URI} component={Logout} />
          <LayoutRoute
            exact
            path="/"
            component={HomePage}
            layout={LayoutBase}
            background={"/background.jpg"}
          />
          <LayoutRoute
            exact
            path={`${POST_PAGE_URI}/:postId`}
            component={BlogPostPage}
            layout={EmptyLayout}
          />
          <LayoutRoute
            exact
            path="*"
            component={UnknownPage}
            layout={EmptyLayout}
          />
        </Switch>
        <GlobalAlerts />
      </MuiPickersUtilsProvider>
    </MuiThemeProvider>
  );
};

export default withAlertMessage(App);
