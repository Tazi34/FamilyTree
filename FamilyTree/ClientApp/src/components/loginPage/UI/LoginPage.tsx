import { Box, Link, makeStyles, Typography } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router";
import { BLOG_PAGE_URI, REGISTER_PAGE_URI } from "../../../applicationRouting";
import { ApplicationState } from "../../../helpers";
import useAlert from "../../alerts/useAlert";
import { LoginUserRequestData } from "../API/loginUser";
import {
  authenticateFacebookToken,
  authenticateGmailToken,
  getUser,
  loginUser,
} from "../authenticationReducer";
import { rememberUserLocalStorageKey } from "../tokenService";
import LoginForm from "./LoginForm";
import SocialMediaLoginPanel from "./SocialMediaLoginPanel";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: 700,
    width: "80%",
  },
  container: {
    height: "100%",
    width: "100%",
    margin: "0 auto",
    // backgroundImage: `url(/background.jpg)`,
    // backgroundSize: "cover",
    // backgroundPosition: "35% center",
    // backgroundRepeat: "no-repeat",
    // opacity: 2,
    // backgroundAttachment: "fixed",
  },
  content: {
    background: "#f4f4f4",

    fontSize: "0.9375rem",
    width: 400,
    position: "relative",
    margin: "0 auto",
    lineHeight: 1.5,
    boxShadow: "0 0.5882rem 2.353rem 0 #202020",
  },
  column: {
    border: "1px solid black",
  },

  contentHeaderContainer: {
    padding: "0.71rem 1.15rem",
    width: "100%",
    background: theme.palette.primary.light,
  },
  contentHeader: {
    fontSize: "1.4rem",
    fontWeight: 400,
    lineHeight: 1.5,
    color: "#f4f4f4",
  },
  panelsContainer: {
    width: "80%",
    margin: "40px auto",
  },
  image: {
    width: "100%",
    height: 700,
  },
  imageContainer: {
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
  panelBreak: {
    marginBottom: 10,
    marginTop: 10,
  },
  familyTreeLoginHeader: {
    marginLeft: 10,
    fontSize: 17,
  },
  familyTreeLoginSection: {
    border: "1px solid rgba(0, 0, 0, 0.23)",
    padding: 5,
  },
  registerSection: {
    marginTop: 10,
    padding: 5,
    border: "1px solid rgba(0, 0, 0, 0.23)",
    marginBottom: 12,
  },
}));

const LoginPage = (props: any) => {
  const classes = useStyles();
  const dispatch: any = useDispatch();
  const user = useSelector(getUser);
  const history = useHistory();
  const alert = useAlert();

  if (user) {
    return <Redirect to={`${BLOG_PAGE_URI}/${user.id}`} />;
  }

  const handleAuthenticationResponse = (response: any) => {
    if (response.error) {
      alert.error("Could not verify your identity. ");
    } else {
      alert.success("Logged in.");
      history.push(`${BLOG_PAGE_URI}/${response.payload.data.userId}`);
    }
    return response;
  };

  const handleRememberUser = (remember: boolean) => {
    localStorage.setItem(rememberUserLocalStorageKey, remember.toString());
  };

  const handleLoginUser = (userData: LoginUserRequestData) => {
    return dispatch(loginUser(userData)).then((data: any) => {
      handleAuthenticationResponse(data);
    });
  };
  const handleGmailAuthentication = (userData: any) => {
    dispatch(authenticateGmailToken(userData.tokenId)).then((data: any) => {
      handleAuthenticationResponse(data);
    });
  };
  const handleFacebookAuthentication = (userData: any) => {
    dispatch(authenticateFacebookToken(userData.accessToken)).then(
      (data: any) => {
        handleAuthenticationResponse(data);
      }
    );
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      id="loginContainer"
      className={classes.container}
    >
      <div className={classes.content}>
        <div className={classes.contentHeaderContainer}>
          <Typography className={classes.contentHeader}>
            Sign in with
          </Typography>
        </div>

        <Box
          display="flex"
          flexDirection="column"
          className={classes.panelsContainer}
        >
          <Box display="inline-flex" flexDirection="column">
            <div className={classes.familyTreeLoginSection}>
              <Typography className={classes.familyTreeLoginHeader}>
                Family Tree account
              </Typography>
              <div>
                <LoginForm
                  onRemember={handleRememberUser}
                  onLoginUser={handleLoginUser}
                ></LoginForm>
              </div>
            </div>

            <Typography align="center" className={classes.panelBreak}>
              Or
            </Typography>
            <div>
              <SocialMediaLoginPanel
                onGmailLogin={handleGmailAuthentication}
                onFacebookLogin={handleFacebookAuthentication}
              />
            </div>
            <div className={classes.registerSection}>
              <Typography align="center">
                No account? <span> </span>
                <Link
                  onClick={() => {
                    history.push(REGISTER_PAGE_URI);
                  }}
                >
                  {"Sing up now"}
                </Link>
              </Typography>
            </div>
          </Box>
        </Box>
      </div>
    </Box>
  );
};

export default LoginPage;
