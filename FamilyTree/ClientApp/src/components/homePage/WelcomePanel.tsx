import { Box, Button, makeStyles, Paper, Typography } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { REGISTER_PAGE_URI } from "../../applicationRouting";
import { RedirectButton } from "../UI/RedirectButton";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    maxWidth: "400px",
  },
  applicationMotto: {
    width: "100%",
    background: theme.palette.primary.dark,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    padding: "5px 0",
  },
  textContainer: {
    padding: "15px 20px",
  },
  button: {},
  buttonContainer: { padding: "0px 10px 10px 10px" },
}));

const WelcomePanel = (props: any) => {
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      <div className={classes.applicationMotto}>
        <Typography color="textPrimary" variant="h5" align="center">
          Welcome to family tree
        </Typography>
      </div>
      <div className={classes.textContainer}>
        <Typography variant="body1" align="center">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum a
          magnam, nemo aliquid beatae officia totam quisquam dolores
          necessitatibus recusandae tempore exercitationem molestiae pariatur
          tenetur ducimus praesentium blanditiis quas atque? Lorem ipsum dolor
          sit, amet consectetur adipisicing elit. Nulla, ipsam nemo quasi,
          aliquid alias in molestias illum dolorem quia architecto voluptate
          consequuntur eum, eligendi id! Repellat labore aperiam sit nulla?
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis
          dolorem unde facere, amet nemo consectetur, id neque in reiciendis
          officia laudantium mollitia sunt, saepe aut sit consequatur. Quod,
          error odio.
        </Typography>
      </div>
      <Box
        display="flex"
        justifyContent="center"
        className={classes.buttonContainer}
      >
        <RedirectButton
          to={REGISTER_PAGE_URI}
          variant="contained"
          color="default"
          className={classes.button}
        >
          Join community
        </RedirectButton>
      </Box>
    </Paper>
  );
};

export default WelcomePanel;
