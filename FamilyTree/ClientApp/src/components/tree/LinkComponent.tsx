import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { EntityId } from "@reduxjs/toolkit";
import * as React from "react";
import DrawableLink from "./DrawableLink";
import { getLinkId } from "./helpers/idHelpers";
import { createPath } from "./helpers/linkCreationHelpers";
import { Node } from "./model/NodeClass";
import { Point } from "./Point";

const useStyles = makeStyles((theme: Theme) => ({}));
export type LinkLoaded = { linkId: EntityId; source: Node; target: Node };
type Props = {
  source: Point;
  target: Point;
  linkId: string;
  familyToChild: boolean;
};
const LinkComponent = ({ source, target, linkId, familyToChild }: Props) => {
  return (
    <DrawableLink
      id={linkId}
      markerMid={familyToChild ? "url(#arrowEnd)" : ""}
      source={source}
      target={target}
    />
  );
};

const areEqual = (prev: Props, newProps: Props) => {
  return (
    prev.source.x === newProps.source.x && prev.source.y === newProps.source.y
  );
};

export default React.memo(LinkComponent, areEqual);
