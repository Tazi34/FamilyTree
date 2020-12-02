import { List, makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { TreeInformation } from "../../model/TreeInformation";
import TreeCard from "./TreeCard";

interface TreeListProps {
  trees: TreeInformation[];
  className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    padding: "5px 10px",
  },
  root: {
    height: "100%",
    overflow: "auto",
  },
}));

const TreesList = ({ trees, className }: TreeListProps) => {
  const classes = useStyles();
  return (
    <List className={classes.root}>
      {trees.map((tree) => (
        <TreeCard className={classes.card} tree={tree} />
      ))}
    </List>
  );
};

export default TreesList;
