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
    transform: `translate(${node.x - 10}px,${node.y - 10}px)`,
    top: 0,
    left: 0,
    borderRadius: "50%",
    width: 20,
    height: 20,
    background: theme.palette.primary.dark,
    cursor: "pointer",
  }),
}));
type Props = {
  family: FamilyNode;
  onSelect: (family: FamilyNode) => void;
  canConnectTo: boolean;
};
//TODO ujednolicic ruszanie z personnode
const FamilyNodeCard = ({ family, onSelect, canConnectTo }: Props) => {
  const classes = useStyles(family);
  const elementId = family.id.toString();

  console.log("RENDER FAMILY");
  if (!(family.fatherId && family.motherId)) {
    return null;
  }
  return (
    <div
      onClick={() => {
        onSelect(family);
      }}
      style={{ backgroundColor: canConnectTo ? "green" : "black" }}
      id={elementId}
      className={classes.familyCard}
    ></div>
  );
};

export default React.memo(FamilyNodeCard);
