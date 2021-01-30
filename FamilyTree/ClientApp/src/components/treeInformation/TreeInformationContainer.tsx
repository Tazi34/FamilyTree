import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { useSelector } from "react-redux";
import { useThunkDispatch } from "../..";
import { ApplicationState } from "../../helpers";
import { TreeInformation } from "../../model/TreeInformation";
import { SendInvitationRequestData } from "../invitation/API/sendInvitation/sendInvitationRequest";
import { sendInvitation } from "../invitation/reducer/invitationsReducer";
import { getUser } from "../loginPage/authenticationReducer";
import TreeInformationPanel from "./TreeInformationPanel";
import {
  changeTreeName,
  changeTreeVisibility,
  exportTree,
} from "../tree/reducer/treeReducer";
import { withAlertMessage } from "../alerts/withAlert";
import useTreeActions from "../tree/TreeActionsProvider";
import useAlert from "../alerts/useAlert";
import {
  selectCanvas,
  selectCanvasCenter,
} from "../canvas/reducer/canvasReducer";
import { CreateNodeRequestData } from "../tree/API/createNode/createNodeRequest";
import { CreateNodeFormData } from "../addNodeActionDialog/CreateTreeNodeDialog";

const useStyles = makeStyles((theme: Theme) => ({}));
type Props = {
  onNodeAddStart: any;
  onNodeAdded: any;

  [x: string]: any;
};

const TreeInformationContainer = ({ onNodeAdd, onDefaultNodeAdd }: any) => {
  const dispatch = useThunkDispatch();
  const user = useSelector(getUser);
  const alert = useAlert();
  const treeInformation = useSelector<ApplicationState, TreeInformation | null>(
    (state) => state.tree.treeInformation
  );

  const handleTreeVisibilityChange = React.useCallback(
    (treeInformation: TreeInformation) => {
      dispatch(changeTreeVisibility(treeInformation));
    },
    [treeInformation]
  );

  const handleTreeNameChange = React.useCallback(
    (treeInformation: TreeInformation, newName: string) => {
      dispatch(changeTreeName({ ...treeInformation, name: newName }));
    },
    [treeInformation]
  );

  const handleInviteUser = React.useCallback(
    (userId: number) => {
      const data: SendInvitationRequestData = {
        hostUserId: user!.id,
        askedUserId: userId,
        treeId: treeInformation!.treeId,
      };
      dispatch(sendInvitation(data)).then((resp: any) => {
        if (!resp.error) {
          alert.success("User invited");
        }
      });
    },
    [treeInformation]
  );

  const handleTreeExport = React.useCallback(() => {
    if (treeInformation) {
      dispatch(exportTree({ treeId: treeInformation.treeId }));
    }
  }, [treeInformation]);

  if (!treeInformation) {
    return null;
  }

  return (
    <TreeInformationPanel
      treeInformation={treeInformation}
      onTreeVisibilityChange={handleTreeVisibilityChange}
      onTreeNameChange={handleTreeNameChange}
      onInviteUser={handleInviteUser}
      onAddNode={onNodeAdd}
      onMockNodeAdd={onDefaultNodeAdd}
      onExportTree={handleTreeExport}
    />
  );
};

export default TreeInformationContainer;
