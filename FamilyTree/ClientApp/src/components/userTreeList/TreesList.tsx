import { List, makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { TreeInformation } from "../../model/TreeInformation";
import TreeCard from "./TreeCard";

interface TreeListProps {
  trees: TreeInformation[];
  onTreeSelect: (tree: TreeInformation) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: "100%",
    width: "100%",
    overflow: "auto",
  },
}));

const TreesList = ({ trees, onTreeSelect }: TreeListProps) => {
  const classes = useStyles();
  return (
    <List className={classes.root}>
      {trees.map((tree) => (
        <TreeCard key={tree.treeId} onTreeSelect={onTreeSelect} tree={tree} />
      ))}
    </List>
  );
};

export default TreesList;
