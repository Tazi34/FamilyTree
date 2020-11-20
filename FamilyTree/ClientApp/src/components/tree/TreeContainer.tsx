import React from "react";
import { RECT_HEIGHT, RECT_WIDTH } from "../../d3/RectMapper";
import { generateTreeStructure } from "../../d3/treeStructureGenerator";
import { Person } from "../../model/TreeStructureInterfaces";
import data from "../../samples/complex.json";

import TreeRenderer from "./TreeRenderer";
import { ZoomContainer } from "./Zoom";

const Context = React.createContext(null);

type TreeContainerProps = {
  width: any;
  height: any;
};
type TreeContainerState = {
  familyTreeEntries: Person[];
};

class TreeContainer extends React.Component<
  TreeContainerProps,
  TreeContainerState
> {
  private svgRef: React.RefObject<any>;

  constructor(props: any) {
    super(props);
    this.state = {
      familyTreeEntries: data as Person[],
    };
    this.svgRef = React.createRef();
  }

  getSvg = () => {
    return this.svgRef.current;
  };

  handleNodeDelete = (nodeId: number) => {
    this.setState({
      familyTreeEntries: this.state.familyTreeEntries.filter(
        (a) => a.id != nodeId
      ),
    });
  };

  render() {
    //TODO uzycie propsow
    const { width, height } = this.props;
    const treeStructure = generateTreeStructure(this.state.familyTreeEntries);
    return (
      <svg ref={this.svgRef} width={"100%"} height={"100%"}>
        <ZoomContainer getSvg={this.getSvg}>
          <TreeRenderer
            onNodeDelete={this.handleNodeDelete}
            treeStructure={treeStructure}
            getSvg={this.getSvg}
            rectHeight={RECT_HEIGHT}
            rectWidth={RECT_WIDTH}
          ></TreeRenderer>
        </ZoomContainer>
      </svg>
    );
  }
}

export function useSvg() {
  return React.useContext(Context);
}

export default TreeContainer;
