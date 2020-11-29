import React from "react";
import { RECT_HEIGHT, RECT_WIDTH } from "../../d3/RectMapper";
import {
  generateTreeStructure,
  generateTreeStructures,
  GetTreeStructures,
} from "../../d3/treeStructureGenerator";
import data from "../../samples/multipleDisconnectedGraphs.js";
import data2 from "../../samples/complex.json";

import TreeRenderer from "./TreeRenderer";
import { ZoomContainer } from "./Zoom";
import MultipleTreesRenderer from "./MultipleTreesRenderer";

const Context = React.createContext(null);

type TreeContainerState = {
  familyTreeEntries: any;
};

class TreeContainer extends React.Component<{}, TreeContainerState> {
  private svgRef: React.RefObject<any>;

  constructor(props: any) {
    super(props);

    this.state = {
      familyTreeEntries: data2,
    };
    this.svgRef = React.createRef();
  }

  getSvg = () => {
    return this.svgRef.current;
  };

  handleNodeDelete = (nodeId: number) => {
    this.setState({
      familyTreeEntries: this.state.familyTreeEntries.filter(
        (a: any) => a.id != nodeId
      ),
    });
  };

  render() {
    var treeStructures = GetTreeStructures(this.state.familyTreeEntries);
    console.log(treeStructures);
    return (
      <svg ref={this.svgRef} width={"100%"} height={"100%"}>
        <ZoomContainer getSvg={this.getSvg}>
          <MultipleTreesRenderer
            trees={treeStructures}
            onNodeDelete={this.handleNodeDelete}
            getSvg={this.getSvg}
            rectHeight={RECT_HEIGHT}
            rectWidth={RECT_WIDTH}
          ></MultipleTreesRenderer>
        </ZoomContainer>
      </svg>
    );
  }
}

export function useSvg() {
  return React.useContext(Context);
}

export default TreeContainer;
