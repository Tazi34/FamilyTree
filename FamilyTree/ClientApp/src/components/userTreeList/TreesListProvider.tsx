import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router";
import { useThunkDispatch } from "../..";
import { TREE_PAGE_URI } from "../../applicationRouting";
import { TreeInformation } from "../../model/TreeInformation";
import { sampleTreesInformations } from "../../samples/componentsSampleData";
import { getUser } from "../loginPage/authenticationReducer";
import TreesList from "./TreesList";
import {
  getUserTrees,
  usersTreesSelectors,
  userTreesAdapter,
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
    ></UserTreePanel>
  );
};

export default UserTreeListProvider;
