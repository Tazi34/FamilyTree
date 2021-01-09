import { Fade, makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import Draggable from "react-draggable";
import { useInView } from "react-intersection-observer";
import { RECT_HEIGHT, RECT_WIDTH } from "../../d3/RectMapper";
import PersonNodeCard from "./PersonNodeCard";

const useStyles = makeStyles((theme: Theme) => ({
  translation: {
    position: "absolute",
    top: 0,
    left: 0,

    transform: `translate(${-RECT_WIDTH / 2}px,${-RECT_HEIGHT / 2}px)`,
    height: RECT_HEIGHT + "px",
    width: RECT_WIDTH + "px",
  },
}));

const DraggablePersonNode = (props: any) => {
  const classes = useStyles();
  const node = props.person;
  const [animate, setAnimate] = React.useState(false);

  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 0,
    root: props.viewRef.current,
    rootMargin: RECT_HEIGHT + "px",
  });

  return (
    <Draggable
      defaultPosition={{
        x: node.x,
        y: node.y,
      }}
      onStart={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDrag={(e, d) => {
        e.preventDefault();
        e.stopPropagation();
        props.onMoveNodeOnCanvas(d, node);
      }}
      onStop={(e, d) => {
        const deltaX = Math.abs(node.x - d.x);
        const deltaY = Math.abs(node.y - d.y);
        const didMove = deltaX > 3 || deltaY > 3;
        if (didMove) {
          e.stopPropagation();
          props.onNodeMove(node, d.x, d.y);
        }
      }}
      scale={props.scale}
    >
      <div ref={ref}>
        <PersonNodeCard
          onNodeVisiblityChange={props.onNodeVisiblityChange}
          onDisconnectNode={props.onDisconnectNode}
          onAddActionMenuClick={props.onAddActionMenuClick}
          canConnectTo={props.canConnectTo}
          disabled={props.disabled}
          onConnectStart={props.onConnectStart}
          onSiblingAdd={props.onSiblingAdd}
          onPartnerAdd={props.onPartnerAdd}
          onNodeSelect={props.onNodeSelect}
          onNodeMove={props.onNodeMove}
          onParentAdd={props.onParentAdd}
          onChildAdd={props.onChildAdd}
          person={node}
          onNodeDelete={props.onNodeDelete}
          onMoveNodeOnCanvas={props.onMoveNodeOnCanvas}
        />
      </div>
    </Draggable>
  );
};

const areEqual = (prev: any, next: any) => {
  if (prev.person.x != next.person.x || prev.person.y != next.person.y) {
    return false;
  }

  return true;
};

export default React.memo(DraggablePersonNode);
