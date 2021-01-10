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

const useStyles = makeStyles((theme: Theme) => ({}));
type Props = {
  onNodeAdd: (node: any) => any;
  [x: string]: any;
};

const TreeInformationContainer = ({
  alertSuccess,
  alertError,
  onNodeAdd,
  onMockNodeAdd,
}: Props) => {
  const classes = useStyles();
  const dispatch = useThunkDispatch();
  const user = useSelector(getUser);
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
          alertSuccess("User invited");
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

  return (
    <TreeInformationPanel
      treeInformation={treeInformation}
      onTreeVisibilityChange={handleTreeVisibilityChange}
      onTreeNameChange={handleTreeNameChange}
      onInviteUser={handleInviteUser}
      onAddNode={onNodeAdd}
      onAddMockNode={onMockNodeAdd}
      onExportTree={handleTreeExport}
    />
  );
};

export default withAlertMessage(TreeInformationContainer);
