import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { EntityId } from "@reduxjs/toolkit";
import * as React from "react";
import { Point } from "../../model/Point";
import DrawableLink from "./DrawableLink";
import { Node } from "../../model/NodeClass";

const useStyles = makeStyles((theme: Theme) => ({}));
export type LinkLoaded = { linkId: EntityId; source: Node; target: Node };
type Props = {
  source: Point;
  target: Point;
  linkId: string;
  familyToChild: boolean;
};
const LinkComponent = ({ source, target, linkId, familyToChild }: Props) => {
  return <DrawableLink id={linkId} source={source} target={target} />;
};

const areEqual = (prev: Props, newProps: Props) => {
  return (
    prev.source.x === newProps.source.x && prev.source.y === newProps.source.y
  );
};

export default React.memo(LinkComponent, areEqual);
