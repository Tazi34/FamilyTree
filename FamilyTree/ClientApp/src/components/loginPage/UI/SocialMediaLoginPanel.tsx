import { Box, Grid, makeStyles, Paper } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import GoogleLogin from "react-google-login";
import userProfileAPI from "../../userProfile/API/userProfileAPI";
import FacebookLogin from "react-facebook-login";

const useStyles = makeStyles((theme: Theme) => ({
  root: { width: "100%", minHeight: 120, padding: "10px 20px" },
  buttonContainer: {
    margin: "10px 0",
  },
}));
type Props = {
  onGmailLogin: (response: any) => void;
};
const SocialMediaLoginPanel = ({ onGmailLogin }: Props) => {
  const classes = useStyles();
  const responseFacebook = (response: any) => {
    console.log(response);
  };
  return (
    <Box
      className={classes.root}
      border={1}
      borderColor={"primary.main"}
      borderRadius={7}
      display="flex"
      flexDirection="column"
      justifyContent="space-around"
    >
      <Box
        className={classes.buttonContainer}
        display="flex"
        flexDirection="column"
        justifyContent="space-around"
      >
        <GoogleLogin
          clientId="941927718703-sabevb4hdfuit5aca0egk363d1lth7m8.apps.googleusercontent.com"
          buttonText="Login"
          onSuccess={onGmailLogin}
          onFailure={(err: any) => {
            console.log(err);
          }}
          cookiePolicy={"single_host_origin"}
        />
      </Box>
      <Box
        className={classes.buttonContainer}
        display="flex"
        flexDirection="column"
        justifyContent="space-around"
      >
        <FacebookLogin
          appId="397727788098228"
          autoLoad={true}
          fields="name,email,picture"
          callback={responseFacebook}
        />
      </Box>
    </Box>
  );
};

export default SocialMediaLoginPanel;
