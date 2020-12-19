import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useThunkDispatch } from "../..";
import { TREE_PAGE_URI } from "../../applicationRouting";
import { TreeInformation } from "../../model/TreeInformation";
import { withAlertMessage } from "../alerts/withAlert";
import { getUser } from "../loginPage/authenticationReducer";
import {
  createTree,
  getUserTrees,
  usersTreesSelectors,
  userTreesStateSelector,
} from "./usersTreeReducer";
import UserTreePanel from "./UserTreePanel";

const useStyles = makeStyles((theme: Theme) => ({}));

const UserTreeListProvider = (props: any) => {
  const classes = useStyles();
  const dispatch = useThunkDispatch();
  const history = useHistory();
  const currentUser = useSelector(getUser);
  const userTreesState = useSelector(userTreesStateSelector);
  const userTrees = useSelector(usersTreesSelectors.selectAll);

  const handleTreeSelect = (tree: TreeInformation) => {
    history.push(`${TREE_PAGE_URI}/${tree.treeId}`);
  };
  const handleTreeCreate = (treeName: string) => {
    dispatch(createTree(treeName)).then((resp: any) => {
      if (resp.error) {
        props.alertError("Couldn't create tree. Contact service provider");
      } else {
        props.alertSuccess("Tree created");
        const treeId = resp.payload.data.treeId;
        history.push(`${TREE_PAGE_URI}/${treeId}`);
      }
    });
  };

  useEffect(() => {
    dispatch(getUserTrees(currentUser!.id));
  }, []);

  if (userTreesState.status.loading) {
    return null;
  }

  return (
    <UserTreePanel
      userTrees={userTrees}
      onTreeSelect={handleTreeSelect}
      onTreeCreate={handleTreeCreate}
    ></UserTreePanel>
  );
};

export default withAlertMessage(UserTreeListProvider);
