import * as React from "react";
import Draggable from "react-draggable";
import { useThunkDispatch } from "../..";
import { disableZoom, enableZoom } from "../canvas/reducer/canvasReducer";
import PersonNodeCard from "./PersonNodeCard";

const DraggablePersonNode = (props: any) => {
  const node = props.person;

  const dispatch = useThunkDispatch();

  return (
    <Draggable
      defaultPosition={{
        x: node.x,
        y: node.y,
      }}
      onStart={(e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(disableZoom());
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
        dispatch(enableZoom());
      }}
      scale={props.scale}
    >
      <div>
        <PersonNodeCard
          onNodeVisiblityChange={props.onNodeVisiblityChange}
          onDisconnectNode={props.onDisconnectNode}
          canConnectTo={props.canConnectTo}
          disabled={props.disabled}
          onConnectStart={props.onConnectStart}
          onNodeSelect={props.onNodeSelect}
          onNodeMove={props.onNodeMove}
          person={node}
          onNodeDelete={props.onNodeDelete}
          onMoveNodeOnCanvas={props.onMoveNodeOnCanvas}
        />
      </div>
    </Draggable>
  );
};

export default React.memo(DraggablePersonNode);
