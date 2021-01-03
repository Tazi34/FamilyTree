import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { EntityId } from "@reduxjs/toolkit";
import * as React from "react";
import { getLinkId } from "./helpers/idHelpers";
import { createPath } from "./helpers/linkCreationHelpers";
import { Node } from "./model/NodeClass";
import { Point } from "./Point";

const useStyles = makeStyles((theme: Theme) => ({
  pathContainer: (props: any) => ({
    position: "relative",
    width: Math.abs(props.source.x - props.target.x) + 50,
    height: Math.abs(props.source.y - props.target.y) + 50,
    zIndex: -10000,
  }),
  path: {
    strokeWidth: 1,
    fill: "none",
    stroke: "white",
  },
}));
export type LinkLoaded = { linkId: EntityId; source: Node; target: Node };
type Props = {
  source: Point;
  target: Point;
  linkId: string;
  familyToChild: boolean;
};
const LinkComponent = ({ source, target, linkId, familyToChild }: Props) => {
  const classes = useStyles({ source, target });
  const path = createPath(source.x, source.y, target.x, target.y) as any;
  console.log("RENDER Link");
  return (
    <path
      id={linkId}
      d={path}
      className={classes.path}
      markerMid={familyToChild ? "url(#arrowEnd)" : ""}
    />
  );
};

const areEqual = (prev: Props, newProps: Props) => {
  return (
    prev.source.x === newProps.source.x && prev.source.y === newProps.source.y
  );
};

export default React.memo(LinkComponent, areEqual);
