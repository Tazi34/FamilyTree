import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { EntityId } from "@reduxjs/toolkit";
import * as React from "react";
import { getLinkId } from "./helpers/idHelpers";
import { createPath } from "./helpers/linkCreationHelpers";
import { Node } from "./model/NodeClass";

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
type Props = { link: LinkLoaded };
const LinkComponent = ({ link }: Props) => {
  const { linkId, source, target } = link;
  const classes = useStyles({ source, target });
  const path = createPath(source.x, source.y, target.x, target.y) as any;
  return (
    <path
      id={getLinkId(source.id, target.id)}
      d={path}
      className={classes.path}
    />
  );
};

export default LinkComponent;
