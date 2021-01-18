import { makeStyles, Paper, Theme } from "@material-ui/core";
import { EntityId } from "@reduxjs/toolkit";
import React from "react";
import { useSelector } from "react-redux";
import { Redirect, withRouter } from "react-router";
import { useThunkDispatch } from "../..";
import { HOME_PAGE_URI } from "../../applicationRouting";
import { ApplicationState } from "../../helpers";
import { TreeInformation } from "../../model/TreeInformation";
import CreateTreeNodeDialog, {
  CreateNodeFormData,
} from "../addNodeActionDialog/CreateTreeNodeDialog";
import useAlert from "../alerts/useAlert";
import { selectCanvasCenter } from "../canvas/reducer/canvasReducer";
import DeleteLastNodeConfirmationDialog from "../deleteLastNodeConfirmationDialog/DeleteLastNodeConfirmationDialog";
import TreeInformationContainer from "../treeInformation/TreeInformationContainer";
import TreeNodeDetailsDialog from "../treeNodesDetails/TreeNodeDetailsDialog";
import { getTree, selectIsOnlyUserInTree } from "./reducer/treeReducer";
import useTreeActions from "./TreeActionsProvider";
import TreeBody from "./TreeBody";

type NodeDialogProps = {
  open: boolean;
  nodeId: EntityId | null;
  startOnEdit?: boolean;
};
const useStyles = makeStyles((theme: Theme) => ({
  treeInformationPanel: {
    width: "100%",
    background: "#fafafa",
  } as any,
  relative: {
    position: "relative",
  } as any,
  treeBackground: {
    width: "100%",
    height: "100%",
    background: "#C7C7BB",
    display: "flex",
    flexDirection: "column",
  } as any,
  root: {
    width: "100%",
    height: "100%",
  },
  treeCanvas: {
    flexGrow: 1,
    width: "100%",
  },
}));

const Tree = (props: any) => {
  const [addDialog, setAddDialog] = React.useState(false);
  const [nodeEditDialog, setNodeEditDialog] = React.useState<NodeDialogProps>({
    nodeId: null,
    open: false,
  });
  const [
    nodeDeleteDialog,
    setNodeDeleteDialog,
  ] = React.useState<NodeDialogProps>({
    nodeId: null,
    open: false,
  });
  const hasSingleUser = useSelector(selectIsOnlyUserInTree);
  const dispatch = useThunkDispatch();
  const alert = useAlert();
  const canvasCenter = useSelector(selectCanvasCenter);
  const classes = useStyles();
  const treeId = parseFloat(props.computedMatch.params.treeId);
  const { onNodeAdd, onDefaultNodeAdd, onNodeDelete } = useTreeActions();
  const treeInformation = useSelector<ApplicationState, TreeInformation | null>(
    (state) => state.tree.treeInformation
  );
  const isLoading = useSelector<ApplicationState, Boolean>(
    (state) => state.tree.isLoading
  );
  React.useEffect(() => {
    //TODO rozwiazanie kwesti goscia - jak wejdzie gosc rzuca blad i elo
    dispatch(getTree(treeId)).then((resp: any) => {
      if (resp.error) {
        alert.error(
          "Error occured while loading the tree. Try again later or contact service provider."
        );
        props.history.push(HOME_PAGE_URI);
      } else {
      }
    });
  }, [treeId]);

  const openAddNodeDialog = () => setAddDialog(true);
  const closeAddNodeDialog = () => setAddDialog(false);

  const handleEditNodeDialogClose = () =>
    setNodeEditDialog({
      open: false,
      nodeId: null,
    });

  const handleEditNodeDialogOpen = (nodeId: EntityId) =>
    setNodeEditDialog({
      open: true,
      nodeId,
    });

  const handleNodeAdd = (formData: CreateNodeFormData) => {
    onNodeAdd(treeId, canvasCenter.x, canvasCenter.y - 50, formData).then(
      (resp: any) => {
        if (resp.error) {
          alert.error("Error creating family member. Try again later.");
        } else {
          alert.success("Family member created sucessfully.");
          closeAddNodeDialog();
        }
      }
    );
  };

  const handleNodeDelete = (nodeId: number, isUser: boolean) => {
    //jesli ostatni user wymagaj potwierdzenia
    if (hasSingleUser && isUser) {
      setNodeDeleteDialog({ open: true, nodeId });
    } else {
      onNodeDelete(nodeId);
    }
  };
  const handleMockNodeAdd = () => {
    onDefaultNodeAdd(treeId, canvasCenter.x, canvasCenter.y - 50);
  };

  if (isLoading) return <div className={classes.treeBackground}></div>;

  if (treeInformation && treeInformation.treeId == 0) {
    return <Redirect to={HOME_PAGE_URI} />;
  }
  return (
    <Paper className={classes.root}>
      <div className={classes.treeBackground}>
        <div className={classes.relative}>
          <div className={classes.treeInformationPanel}>
            <TreeInformationContainer
              onNodeAdd={openAddNodeDialog}
              onDefaultNodeAdd={handleMockNodeAdd}
            />
          </div>
        </div>
        <TreeBody
          onNodeDelete={handleNodeDelete}
          onEditNodeDialogOpen={handleEditNodeDialogOpen}
        />
      </div>
      <CreateTreeNodeDialog
        onSubmit={handleNodeAdd}
        open={addDialog}
        onClose={closeAddNodeDialog}
      />
      <DeleteLastNodeConfirmationDialog
        onConfirm={onNodeDelete}
        nodeId={nodeDeleteDialog.nodeId}
        open={nodeDeleteDialog.open}
        onClose={() => setNodeDeleteDialog({ nodeId: null, open: false })}
      />
      {nodeEditDialog.nodeId && (
        <TreeNodeDetailsDialog
          startOnEdit={nodeEditDialog.startOnEdit}
          open={nodeEditDialog.open}
          nodeId={nodeEditDialog.nodeId}
          onClose={handleEditNodeDialogClose}
        />
      )}
    </Paper>
  );
};

export default withRouter(Tree);
