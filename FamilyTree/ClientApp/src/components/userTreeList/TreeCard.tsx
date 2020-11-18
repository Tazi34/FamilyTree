import { Box, makeStyles, Paper, Typography } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import * as React from "react";
import { TreeInformation } from "../../model/TreeInformation";

interface TreeCardProps {
  tree: TreeInformation;
  className: string;
}
const useStyles = makeStyles((theme: Theme) => ({
  card: {
    height: 70,
    padding: 5,
  },
  grow: {
    flex: 1,
  },
  treeInfo: {
    color: theme.palette.primary.dark,
  },
  treeName: {},
}));
const TreeCard = ({ tree, className }: TreeCardProps) => {
  const classes = useStyles();
  const isPublic = tree.isPublic;
  const publicText = isPublic ? "public " : "private";

  return (
    <div className={className}>
      <Box
        border={1}
        borderRadius="borderRadius"
        borderColor="primary.main"
        bgcolor="background.paper"
        className={classes.card}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        alignItems="stretch"
      >
        <Typography
          variant={"subtitle1"}
          align="left"
          className={classes.treeName}
        >
          {tree.name}
        </Typography>
        <div className={classes.grow}></div>
        <Typography
          variant={"subtitle2"}
          align="right"
          className={classes.treeInfo}
        >
          {tree.members} members, {publicText}
        </Typography>
      </Box>
    </div>
  );
};

export default TreeCard;
