import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { D3DragEvent } from "d3";
import * as React from "react";
import { FamilyNode } from "./model/FamilyNode";
import { Node } from "./model/NodeClass";
const d3 = require("d3");

const useStyles = makeStyles((theme: Theme) => ({
  familyCard: (node: FamilyNode) => ({
    position: "absolute",
    transform: `translate(${node.x - 6}px,${node.y - 6}px)`,
    top: 0,
    left: 0,
    borderRadius: "50%",
    width: 10,
    height: 10,
    background: theme.palette.primary.dark,
    cursor: "pointer",
  }),
}));
type Props = {
  family: FamilyNode;
};
//TODO ujednolicic ruszanie z personnode
const FamilyNodeCard = ({ family }: Props) => {
  const classes = useStyles(family);
  const elementId = family.id.toString();

  console.log("RENDER FAMILY");
  if (!(family.fatherId && family.motherId)) {
    return null;
  }
  return <div id={elementId} className={classes.familyCard}></div>;
};

export default React.memo(FamilyNodeCard);
