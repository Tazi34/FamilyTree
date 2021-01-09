import { Divider, List, makeStyles } from "@material-ui/core";
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
  skeleton: {
    marginBottom: 5,
  },
}));
//
const TreesList = ({ trees, onTreeSelect, loading }: TreeListProps) => {
  const classes = useStyles();
  return (
    <List className={classes.root}>
      {!loading &&
        trees.map((tree) => (
          <div>
            <TreeCard
              key={tree.treeId}
              onTreeSelect={onTreeSelect}
              tree={tree}
            />
            <Divider />
          </div>
        ))}
      {loading &&
        [...Array(6)]
          .map(Math.random)
          .map((_, index) => (
            <Skeleton
              key={index}
              className={classes.skeleton}
              height={150}
              variant="rect"
            />
          ))}
    </List>
  );
};

export default TreesList;
