import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import Draggable from "react-draggable";
import { connect, useSelector } from "react-redux";
import { ApplicationState } from "../../helpers";
import LinkComponent, { LinkLoaded } from "./LinkComponent";
import { Link } from "./model/Link";
import { PersonNode } from "./model/PersonNode";
import PersonNodeCard from "./PersonNodeCard";
import {
  linkLoader,
  selectAllLinks,
  selectAllPersonNodes,
} from "./reducer/treeReducer";

class Links extends React.Component<any> {
  render() {
    return (
      <svg
        style={{
          position: "absolute",
          width: 10,
          height: 10,
          top: 0,
          left: 0,
          zIndex: -100000,
          overflow: "visible",
        }}
      >
        <marker
          id="arrowEnd"
          fill="blue"
          stroke-linejoin="bevel"
          viewBox="0 0 8000 8000"
          refX="280"
          refY="150"
          markerUnits="strokeWidth"
          markerWidth="300"
          markerHeight="300"
          orient="auto"
        >
          <path
            id="arrowEndPath"
            stroke="rgb(0, 0, 0)"
            stroke-width="5"
            d="M 2 59 L 293 148 L 1 243 L 121 151 Z"
          />
        </marker>

        {this.props.links.map((loadedLink: LinkLoaded) => (
          <LinkComponent
            familyToChild={loadedLink.source.isFamily}
            key={loadedLink.linkId}
            linkId={loadedLink.linkId.toString()}
            source={{ x: loadedLink.source.x, y: loadedLink.source.y }}
            target={{ x: loadedLink.target.x, y: loadedLink.target.y }}
          />
        ))}
      </svg>
    );
  }
}

export default Links;
