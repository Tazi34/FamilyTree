import {
  Box,
  Grid,
  Hidden,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import SocialMediaLoginPanel from "./SocialMediaLoginPanel";
import StandardLoginPanel from "./StandardLoginPanel";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: 700,
    width: "80%",
  },
  container: {
    height: "100%",
    width: "80%",
    margin: "0 auto",
  },
  column: {
    border: "1px solid black",
  },
  grid: {
    height: "100%",
  },

  panelsContainer: {
    height: "100%",
  },
  image: {
    width: "100%",
  },
  imageContainer: {
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
}));

const LoginPage = (props: any) => {
  const classes = useStyles();
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      id="loginContainer"
      className={classes.container}
    >
      <Paper className={classes.root}>
        <Grid container alignItems="stretch" className={classes.grid}>
          <Grid item sm={12} lg={6}>
            <Box
              display="flex"
              justifyContent="center"
              className={classes.panelsContainer}
            >
              <Box
                display="inline-flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
              >
                <StandardLoginPanel></StandardLoginPanel>
                <Typography align="center">Or</Typography>
                <SocialMediaLoginPanel></SocialMediaLoginPanel>
              </Box>
            </Box>
          </Grid>

          <Grid item sm={6} className={classes.imageContainer}>
            <Box display="flex" alignItems="center" style={{ height: "100%" }}>
              <img
                src="/wip.jpg"
                alt="work in progress placeholder"
                className={classes.image}
              ></img>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default LoginPage;
