import { Theme, withStyles } from "@material-ui/core";
import * as React from "react";

const styles = (theme: Theme) => ({
  menu: {
    position: "absolute",
    background: "red",
    height: 40,
    width: 50,
    bottom: "100%",
  } as any,
});

class NodeActionsMenu extends React.Component<any, any> {
  render = () => {
    const classes = this.props.classes;
    return <div className={classes.menu}>MENU</div>;
  };
}
export default withStyles(styles)(NodeActionsMenu);
