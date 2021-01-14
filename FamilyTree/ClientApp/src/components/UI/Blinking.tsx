import { Fade, makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";

const useStyles = makeStyles((theme: Theme) => ({
  blinkBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    zIndex: -100000000000,
  },
  blinkRelative: {
    position: "relative",
  },
}));

const Blinking = (props: any) => {
  const classes = useStyles();
  const [fadeIn, setFadeIn] = React.useState(true);

  return (
    <div className={classes.blinkRelative}>
      {props.children}
      {props.blink && (
        <Fade
          in={fadeIn}
          onEntered={() => setFadeIn(false)}
          onExited={() => setFadeIn(true)}
          timeout={1000}
        >
          <div
            className={classes.blinkBackground}
            style={{ background: props.background }}
          />
        </Fade>
      )}
    </div>
  );
};

export default Blinking;
