import { Avatar, Fade, makeStyles, Zoom } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";

const size = 70;
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: "absolute",
    transform: `translate3d(${-size / 2}px,${-size / 2}px,0)`,
    height: size,
    width: size,
    borderRadius: "50%",
    border: "2px solid" + theme.palette.primary.light,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.primary.dark,
  },
}));

const HiddenPersonNode = ({ hidden, picture, initials, onClick }: any) => {
  const classes = useStyles();

  return (
    <Zoom in={!hidden} timeout={1000} style={{ transitionDelay: "1000ms" }}>
      <div>
        <Avatar
          src={picture}
          className={classes.root}
          onClick={onClick}
          //style={{ visibility: hidden ? "hidden" : "visible" }}
        >
          {initials ?? ""}
        </Avatar>
      </div>
    </Zoom>
  );
};

export default React.memo(HiddenPersonNode);
