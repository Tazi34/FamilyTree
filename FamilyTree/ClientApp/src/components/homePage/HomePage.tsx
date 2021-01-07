import { Button, Fade, makeStyles, Slide, Typography } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useThunkDispatch } from "../..";
import { BLOG_PAGE_URI, LOGIN_PAGE_URI } from "../../applicationRouting";
import { closeAllChats } from "../chat/reducer/closeAllChats";
import { getUser } from "../loginPage/authenticationReducer";
import "./homePage.css";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: "0 auto",
    width: "100%",
    height: "100%",
    // backgroundImage:"url(/background.jpg)"
    // backgroundSize: "cover",
    // backgroundPosition: "35% center",
    // backgroundRepeat: "no-repeat",
    // opacity: 2,
    // backgroundAttachment: "fixed",
  },
  bannerTitle: {
    fontSize: 65,
    fontFamily: `"Avenir LT W05_35 Light",Arial,Helvetica,sans-serif`,
    color: "#fff",
    letterSpacing: "normal",
  },
  bannerBreak: {
    margin: "0 auto",
    marginBottom: 25,
    marginTop: 15,
    width: 70,
    borderTop: "3px solid rgba(255, 255, 255, .7)",
  },
  bannerDescription: {
    fontSize: 22,
    fontFamily: `"Avenir LT W05_35 Light",Arial,Helvetica,sans-serif`,
    color: "#ffffff",
    letterSpacing: "normal",
    padding: "0 28%",
    lineHeight: "1.25rem",
  },
  heroTextFlex: {
    height: "100%",
  },
  main: {
    marginTop: "30vh",
  },
  welcomePanel: {
    [theme.breakpoints.down("md")]: {
      margin: "0 auto",
    },
  },
  familyIcon: {
    height: 90,
    width: 90,
    textAlign: "center",
  },
  buttonContainer: {
    textAlign: "center",
    marginTop: 60,
  },
  button: {
    fontSize: 17,
    color: "#ffffff",
    fontFamily: `"Avenir LT W04_65 Medium1475536", Arial,Helvetica,sans-serif`,
    padding: "20px 45px",
    border: "1px solid #ffffff",
  },
}));

const HomePage = (props: any) => {
  const classes = useStyles();
  const transition = props.backgroundLoaded;
  const dispatch = useThunkDispatch();
  dispatch(closeAllChats());

  const history = useHistory();
  const user = useSelector(getUser);
  const redirect = () => {
    let path = "";
    if (user) {
      path = `${BLOG_PAGE_URI}/${user.id}`;
    } else {
      path = `${LOGIN_PAGE_URI}`;
    }
    history.push(path);
  };
  return (
    <div className={classes.root}>
      <div className={classes.main}>
        <div className={classes.familyIcon}></div>
        <Slide
          timeout={1000}
          direction="up"
          in={transition}
          mountOnEnter
          unmountOnExit
        >
          <Fade timeout={1000} in={transition} mountOnEnter unmountOnExit>
            <div>
              <Typography
                variant="h3"
                align="center"
                className={classes.bannerTitle}
              >
                Family Tree
              </Typography>
              <hr className={classes.bannerBreak} />
              <Typography align="center" className={classes.bannerDescription}>
                Connect people, and data using interactive family trees. Share
                your memories with relatives.
              </Typography>
              <div className={classes.buttonContainer}>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  onClick={redirect}
                >
                  {user ? "EXPLORE" : "SIGN IN"}
                </Button>
              </div>
            </div>
          </Fade>
        </Slide>
      </div>
    </div>
  );
};

export default HomePage;
