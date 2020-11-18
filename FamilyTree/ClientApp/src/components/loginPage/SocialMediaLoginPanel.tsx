import { Box, Grid, makeStyles, Paper } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import GoogleLogin from "react-google-login";
const useStyles = makeStyles((theme: Theme) => ({
  root: { width: "100%", minHeight: 120, padding: "10px 20px" },
  buttonContainer: {
    margin: "10px 0",
  },
}));

const SocialMediaLoginPanel = (props: any) => {
  const classes = useStyles();
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
          clientId="65897l3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
          buttonText="Login"
          onSuccess={() => {}}
          onFailure={() => {}}
          cookiePolicy={"single_host_origin"}
        />
      </Box>
      <Box
        className={classes.buttonContainer}
        display="flex"
        flexDirection="column"
        justifyContent="space-around"
      >
        <GoogleLogin
          clientId="65897l3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
          buttonText="Login"
          onSuccess={() => {}}
          onFailure={() => {}}
          cookiePolicy={"single_host_origin"}
        />
      </Box>
    </Box>
  );
};

export default SocialMediaLoginPanel;
