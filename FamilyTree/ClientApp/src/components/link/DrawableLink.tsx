import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { createPath } from "../tree/helpers/linkCreationHelpers";
import { Point } from "../../model/Point";

const useStyles = makeStyles((theme: Theme) => ({
  path: {
    strokeWidth: 3,
    fill: "none",
    stroke: "white",
  },
}));

type Props = {
  source: Point;
  target: Point;
  [x: string]: any;
};
const DrawableLink = ({ source, target, ...otherProps }: Props) => {
  const classes = useStyles();
  const path = createPath(source.x, source.y, target.x, target.y) as any;

  return <path {...otherProps} d={path} className={classes.path}></path>;
};

export default React.memo(DrawableLink);
