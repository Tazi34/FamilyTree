import {
  Box,
  Card,
  CardActionArea,
  ListItem,
  makeStyles,
  Paper,
  Typography,
  ListItemText,
} from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import * as React from "react";
import { areEqualShallow } from "../../helpers/helpers";
import { TreeInformation } from "../../model/TreeInformation";

interface TreeCardProps {
  tree: TreeInformation;
  onTreeSelect: (tree: TreeInformation) => void;
}
const useStyles = makeStyles((theme: Theme) => ({
  card: {
    height: 150,
    padding: 5,
    marginTop: 5,
    paddingLeft: 15,
    width: "100%",
    "&:focus": {
      outline: "none",
    },
  },
  grow: {
    flex: 1,
  },
  treeInfo: {
    color: theme.palette.primary.dark,
  },
  treeName: {},
}));
const TreeCard = ({ tree, onTreeSelect }: TreeCardProps) => {
  const classes = useStyles();
  const isPrivate = tree.isPrivate;
  const treeVisibilityText = isPrivate ? "private" : "public";
  console.log("TREE CARD");
  const handleCardSelect = () => {
    onTreeSelect(tree);
  };
  return (
    <ListItem button className={classes.card} onClick={handleCardSelect}>
      <ListItemText
        primary={tree.name}
        secondary={treeVisibilityText}
      ></ListItemText>
    </ListItem>
  );
};

const areEqual = (prev: TreeCardProps, next: TreeCardProps) => {
  return areEqualShallow(prev.tree, next.tree);
};
export default React.memo(TreeCard, areEqual);
