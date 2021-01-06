import { List, makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import Skeleton from "@material-ui/lab/Skeleton";
import * as React from "react";
import { TreeInformation } from "../../model/TreeInformation";
import TreeCard from "./TreeCard";

interface TreeListProps {
  trees: TreeInformation[];
  onTreeSelect: (tree: TreeInformation) => void;
  loading: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: "100%",
    width: "100%",
    overflow: "auto",
  },
}));
//
const TreesList = ({ trees, onTreeSelect, loading }: TreeListProps) => {
  const classes = useStyles();
  return (
    <List className={classes.root}>
      {!loading &&
        trees.map((tree) => (
          <TreeCard key={tree.treeId} onTreeSelect={onTreeSelect} tree={tree} />
        ))}
      {loading && <Skeleton height={150} variant="rect" />}
    </List>
  );
};

export default TreesList;
