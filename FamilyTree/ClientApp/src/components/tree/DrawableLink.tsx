import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { createPath } from "./helpers/linkCreationHelpers";
import { Point } from "./Point";

const useStyles = makeStyles((theme: Theme) => ({
  path: {
    strokeWidth: 1,
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
  console.log("RENDER Link");
  return <path {...otherProps} d={path} className={classes.path} />;
};

export default React.memo(DrawableLink);
