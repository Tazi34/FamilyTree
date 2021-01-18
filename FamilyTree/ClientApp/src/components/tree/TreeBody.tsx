import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import React from "react";
import { useSelector } from "react-redux";
import { ApplicationState } from "../../helpers";
import { PersonNode } from "../../model/PersonNode";
import { selectCanvas } from "../canvas/reducer/canvasReducer";
import MovableCanvas from "./MovableCanvas";
import useTreeActions from "./TreeActionsProvider";

import TreeRenderer from "./TreeRenderer";
const PanZoom = require("react-easy-panzoom").default;

const useStyles = makeStyles((theme: Theme) => ({
  zoomContainer: {
    flexGrow: 1,
  },
}));

type CanvasZoom = {
  x: number;
  y: number;
  scale: number;
};

type Props = {
  onEditNodeDialogOpen: any;
  onNodeDelete: (id: number, isUser: boolean) => void;
};
const TreeBody = ({ onEditNodeDialogOpen, onNodeDelete }: Props) => {
  const classes = useStyles();
  const treeId = useSelector<ApplicationState, number>(
    (state) => state.tree.treeId ?? 0
  );
  const treeActions = useTreeActions();
  const canvas = useSelector(selectCanvas);

  const handleAsChildConnect = (
    childNode: number,
    parentNode: number,
    secondParentNode?: number
  ) => {
    treeActions.onAsChildConnect(
      treeId,
      childNode,
      parentNode,
      secondParentNode
    );
  };
  return (
    <div id="tree-canvas" className={classes.zoomContainer}>
      <MovableCanvas>
        <TreeRenderer
          onEditNodeDialogOpen={onEditNodeDialogOpen}
          onDisconnectNode={treeActions.onNodeDisconnect}
          onHideBranch={treeActions.onBranchHide}
          onConnectAsChild={handleAsChildConnect}
          onConnectAsPartner={treeActions.onAsPartnerConnect}
          positionX={canvas.x}
          positionY={canvas.y}
          scale={canvas.scale}
          onNodeDelete={onNodeDelete}
        />
      </MovableCanvas>
    </div>
  );
};
export default TreeBody;
