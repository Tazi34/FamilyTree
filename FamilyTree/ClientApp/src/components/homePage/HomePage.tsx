import { Box, Grid, makeStyles, Paper, Typography } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router";
import { BLOG_PAGE_URI } from "../../applicationRouting";
import { getUser } from "../loginPage/authenticationReducer";
import WelcomePanel from "./WelcomePanel";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: "0 auto",
    height: "100%",
    width: "80%",
  },
  heroTextContainer: {
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
    maxWidth: "50%",
    marginRight: 50,
  },
  heroTextFlex: {
    height: "100%",
  },
  welcomePanel: {
    [theme.breakpoints.down("md")]: {
      margin: "0 auto",
    },
  },
}));

const HomePage = (props: any) => {
  const classes = useStyles();

  const user = useSelector(getUser);
  if (user) return <Redirect to={`${BLOG_PAGE_URI}/${user.id}`} />;
  return (
    <Box
      display="flex"
      flexDirection="row"
      alignContent="center"
      alignItems="center"
      className={classes.root}
    >
      <div className={classes.heroTextContainer}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          className={classes.heroTextFlex}
        >
          <Typography variant="h3" align="right">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
          </Typography>
        </Box>
      </div>
      <div className={classes.welcomePanel}>
        <WelcomePanel></WelcomePanel>
      </div>
    </Box>
  );
};

export default HomePage;
