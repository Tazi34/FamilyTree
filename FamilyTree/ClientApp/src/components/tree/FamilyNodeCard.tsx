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
    transform: `translate(${node.x - 5}px,${node.y - 5}px)`,
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
  onNodeMove: (node: Node, x: number, y: number) => void;
  onMoveNodeOnCanvas: (e: DragEvent, node: Node) => void;
};
//TODO ujednolicic ruszanie z personnode
const FamilyNodeCard = ({ family, onNodeMove, onMoveNodeOnCanvas }: Props) => {
  const [location, setLocation] = React.useState({
    x: family.x,
    y: family.y,
  });
  const classes = useStyles(family);
  const elementId = "n" + family.id;
  React.useEffect(() => {
    var dragHandler = d3
      .drag()
      .subject((e: any, d: any) => {
        return {
          x: location.x,
          y: location.y,
        };
      })
      .on("drag", (e: any, d: any) => {
        // d3.select(`#${elementId}`).style(
        //   "transform",
        //   `translate(${e.x}px,${e.y}px)`
        // );
        onMoveNodeOnCanvas(e, family);
        // setLocation({ x: e.x, y: e.y });
      })
      .on("end", (e: D3DragEvent<any, any, Node>, node: Node) => {
        onNodeMove(family, e.x, e.y);
      });

    const element = d3.select("#" + elementId);
    dragHandler(element);
    d3.selectAll(".not-draggable").on("mousedown", function (e: any) {
      e.stopPropagation();
    });
  }, []);
  return <div id={elementId as string} className={classes.familyCard}></div>;
};

export default FamilyNodeCard;
