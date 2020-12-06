import { Box, Grid, makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import LayoutBase from "./LayoutBase";

const useStyles = makeStyles((theme: Theme) => ({
  grid: { height: "100%" },
  column: {
    maring: 0,
    padding: 0,
  },
}));

export interface LayoutPanelProperties {
  component: React.ReactNode;
  flex: number;
}

export default (props: {
  leftPanel?: React.ReactNode;
  children?: React.ReactNode;
  rightPanel?: React.ReactNode;
}) => {
  const classes = useStyles();
  return (
    <LayoutBase>
      <Grid container direction="row" className={classes.grid} justify="center">
        <Grid item xs={2} className={classes.column}>
          {props.leftPanel}
        </Grid>
        <Grid item xs={9} className={classes.column}>
          {props.children}
        </Grid>
        <Grid item xs={1} className={classes.column}>
          {props.rightPanel}
        </Grid>
      </Grid>
    </LayoutBase>
  );
};