import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useThunkDispatch } from "../..";
import { sampleTreesInformations } from "../../samples/componentsSampleData";
import { getUser } from "../loginPage/authenticationReducer";
import TreesList from "./TreesList";
import {
  getUserTrees,
  usersTreesSelectors,
  userTreesAdapter,
  userTreesStateSelector,
} from "./usersTreeReducer";

const useStyles = makeStyles((theme: Theme) => ({}));

const TreesListProvider = (props: any) => {
  const classes = useStyles();
  const dispatch = useThunkDispatch();
  const currentUser = useSelector(getUser);
  const userTreesState = useSelector(userTreesStateSelector);
  const userTrees = useSelector(usersTreesSelectors.selectAll);

  useEffect(() => {
    dispatch(getUserTrees(currentUser!.id));
  }, []);
  if (userTreesState.status.loading) {
    return null;
  }

  return <TreesList trees={userTrees}></TreesList>;
};

export default TreesListProvider;
