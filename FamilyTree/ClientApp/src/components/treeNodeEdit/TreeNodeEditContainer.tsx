import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { useThunkDispatch } from "../..";
import { PersonNode } from "../../model/PersonNode";
import { TreeNodeDetailsFormProps } from "../addNodeActionDialog/TreeNodeDetailsForm";
import useAlert from "../alerts/useAlert";
import { UpdateNodeRequestData } from "../tree/API/updateNode/updateNodeRequest";
import { uploadTreeNodePictureRequest } from "../tree/reducer/updateNodes/setNodePicture";
import { updateTreeNode } from "../tree/reducer/updateNodes/updateNode";
import TreeNodeEdit from "./TreeNodeEdit";

const useStyles = makeStyles((theme: Theme) => ({}));

type Props = {
  node: PersonNode;
  onClose: () => void;
};
const TreeNodeEditContainer = ({ node, onClose }: Props) => {
  const classes = useStyles();

  const dispatch = useThunkDispatch();
  const alert = useAlert();
  const handlePictureSet = (data: any) => {
    if (data) {
      dispatch(
        uploadTreeNodePictureRequest({
          nodeId: node.id as number,
          picture: data,
        })
      ).then((response: any) => {
        if (response.error) {
          alert.error("Couln't upload picture.");
        } else {
          alert.success("Picture uploaded.");
        }
      });
    }
  };
  const handleEdit = (values: TreeNodeDetailsFormProps) => {
    var date = new Date(values.birthday);
    date.setHours(5);
    const data: UpdateNodeRequestData = {
      ...values,
      nodeId: node.id as number,
      children: node.children as number[],
      fatherId: (node.fatherId ?? 0) as number,
      motherId: (node.motherId ?? 0) as number,
      partners: node.partners as number[],
      userId: node.userId as any,
      treeId: node.treeId,
      sex: values.sex,
      birthday: date.toISOString(),
    };
    dispatch(updateTreeNode(data)).then((resp: any) => {
      //TODO error handling
      if (resp.error) {
        // if (onError) {
        //   onError("Could not modify node.");
        // }
      } else {
        // if (onSuccess) {
        //   onSuccess("Tree node modified. ");
        // }
        onClose();
      }
    });
  };
  return (
    <TreeNodeEdit
      onPictureSet={handlePictureSet}
      node={node}
      onClose={onClose}
      onEdit={handleEdit}
    />
  );
};

export default TreeNodeEditContainer;
