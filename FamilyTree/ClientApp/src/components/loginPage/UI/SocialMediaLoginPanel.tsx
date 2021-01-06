import { Box, Button, Grid, IconButton, makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";

import GoogleLogin from "react-google-login";
import { logger } from "../../../helpers/logger";
import FacebookIcon from "@material-ui/icons/Facebook";

const FacebookLogin = require("react-facebook-login/dist/facebook-login-render-props.js")
  .default;

const useStyles = makeStyles((theme: Theme) => ({
  root: { width: "100%" },
  buttonContainer: {
    margin: "10px 0",
  },

  button: {
    borderRadius: 0,
    width: "100%",
  },
  googleIcon: {
    fontSize: 24,
    paddingTop: 4,
    paddingBottom: 4,
  },
  facebookIcon: {
    fontSize: 32,
  },
}));
type Props = {
  onGmailLogin: (response: any) => void;
  onFacebookLogin: (response: any) => void;
};
const SocialMediaLoginPanel = ({ onGmailLogin, onFacebookLogin }: Props) => {
  const classes = useStyles();

  return (
    <Grid className={classes.root} container>
      <Grid item xs={6}>
        <GoogleLogin
          clientId="941927718703-sabevb4hdfuit5aca0egk363d1lth7m8.apps.googleusercontent.com"
          buttonText="Login"
          onSuccess={onGmailLogin}
          onFailure={(err: any) => {
            logger.log(err);
          }}
          render={(renderProps) => (
            <Button
              variant="outlined"
              className={classes.button}
              onClick={renderProps.onClick}
            >
              <i
                className={`fab fa-google ${classes.googleIcon}`}
                style={{ color: "#DB4437" }}
              ></i>
            </Button>
          )}
          cookiePolicy={"single_host_origin"}
        />
      </Grid>
      <Grid item xs={6}>
        <FacebookLogin
          render={(renderProps: any) => (
            <Button
              variant="outlined"
              className={classes.button}
              onClick={renderProps.onClick}
            >
              <FacebookIcon
                style={{ color: "#3b5998" }}
                className={classes.facebookIcon}
              />
            </Button>
          )}
          icon={FacebookIcon}
          cssClass={classes.button}
          appId="397727788098228"
          callback={onFacebookLogin}
        />
      </Grid>
    </Grid>
  );
};

export default SocialMediaLoginPanel;
