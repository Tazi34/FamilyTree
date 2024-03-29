import { Dialog, IconButton, makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import EditIcon from "@material-ui/icons/Edit";
import PanoramaFishEyeIcon from "@material-ui/icons/PanoramaFishEye";
import { EntityId } from "@reduxjs/toolkit";
import * as React from "react";
import { useSelector } from "react-redux";
import { ApplicationState } from "../../helpers";
import { PersonNode } from "../../model/PersonNode";
import { selectPersonNode } from "../tree/reducer/treeReducer";
import TreeNodeEditContainer from "../treeNodeEdit/TreeNodeEditContainer";
import TooltipMouseFollow from "../UI/TooltipMouseFollow";
import TreeNodeDetails from "./TreeNodeDetails";

const useStyles = makeStyles((theme: Theme) => ({
  actionsSection: {
    position: "absolute",
    top: 0,
    right: 0,
  },

  relativeContainer: {
    position: "relative",
  },
}));
export type TreeNodeDialogProps = {
  open: boolean;
  nodeId: EntityId;
  onClose: () => void;
  startOnEdit?: boolean;
};

const TreeNodeDetailsDialog = ({
  open,
  onClose,
  nodeId,
}: TreeNodeDialogProps) => {
  const classes = useStyles();
  const [editMode, setEditMode] = React.useState(false);

  const node = useSelector<ApplicationState, PersonNode | undefined>((state) =>
    selectPersonNode(state, nodeId)
  );

  if (!node) {
    return null;
  }
  const canEdit = node.canEdit;

  return (
    <Dialog open={open} onClose={onClose}>
      <div className={classes.relativeContainer}>
        {editMode ? (
          <TreeNodeEditContainer
            node={node}
            onClose={() => setEditMode(false)}
          />
        ) : (
          <TreeNodeDetails onClose={onClose} details={node.personDetails} />
        )}
        <div className={classes.actionsSection}>
          {canEdit && (
            <TooltipMouseFollow title="Edit information">
              <IconButton onClick={() => setEditMode(!editMode)}>
                {editMode ? <PanoramaFishEyeIcon /> : <EditIcon />}
              </IconButton>
            </TooltipMouseFollow>
          )}
        </div>
        )
      </div>
    </Dialog>
  );
};

export default TreeNodeDetailsDialog;
