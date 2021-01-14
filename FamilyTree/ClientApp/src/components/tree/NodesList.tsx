import * as React from "react";
import { PersonNode } from "../../model/PersonNode";
import DraggablePersonNode from "./DraggablePersonNode";

class NodesList extends React.Component<any> {
  render() {
    const props = this.props;

    return (
      <div>
        {this.props.nodes.map((node: PersonNode) => {
          return (
            <DraggablePersonNode
              onNodeVisiblityChange={this.props.onNodeVisiblityChange}
              onDisconnectNode={this.props.onDisconnectNode}
              onAddActionMenuClick={props.onAddActionMenuClick}
              canConnectTo={this.props.possibleConnections.includes(node.id)}
              disabled={this.props.disabled}
              viewRef={this.props.viewRef}
              key={node.id}
              scale={props.scale}
              onNodeSelect={props.onNodeSelect}
              onNodeMove={props.onNodeMove}
              onParentAdd={props.onParentAdd}
              onChildAdd={props.onChildAdd}
              onConnectStart={props.onConnectStart}
              person={node}
              onNodeDelete={props.onNodeDelete}
              onMoveNodeOnCanvas={props.onMoveNodeOnCanvas}
              onPartnerAdd={props.onPartnerAdd}
            />
          );
        })}
      </div>
    );
  }
}

export default NodesList;
