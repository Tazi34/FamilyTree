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
import {
  ClickAwayListener,
  makeStyles,
  Menu,
  MenuItem,
  MenuList,
  Paper,
  Theme,
} from "@material-ui/core";
import { Console } from "console";

const Context = React.createContext(null);

type TreeContainerState = {
  familyTreeEntries: any;
  isAddMenuOpen: boolean;
  addMenuX: number;
  addMenuY: number;
};

class TreeContainer extends React.Component<{}, TreeContainerState> {
  private svgRef: React.RefObject<any>;

  constructor(props: any) {
    super(props);

    this.state = {
      addMenuX: 0,
      addMenuY: 0,
      isAddMenuOpen: true,
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

  handleNodeAdd = (event: any) => {
    event.preventDefault();
    console.log(event);
    this.setState({
      isAddMenuOpen: !this.state.isAddMenuOpen,
      addMenuX: event.x,
      addMenuY: event.y,
    });
  };
  handleCloseMenu = (e: any) => {
    if (this.state.isAddMenuOpen) {
      this.setState({ isAddMenuOpen: false });
    }
  };
  handleConnectChild = () => {};
  render() {
    var treeStructures = GetTreeStructures(this.state.familyTreeEntries);
    console.log(treeStructures);
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <svg ref={this.svgRef} width={"100%"} height={"100%"}>
          <ZoomContainer
            getSvg={this.getSvg}
            onMouseMove={this.handleCloseMenu}
          >
            <MultipleTreesRenderer
              trees={treeStructures}
              onNodeDelete={this.handleNodeDelete}
              getSvg={this.getSvg}
              onAddNodeMenuOpen={this.handleNodeAdd}
              onAddNodeMenuClose={this.handleCloseMenu}
              rectHeight={RECT_HEIGHT}
              rectWidth={RECT_WIDTH}
            ></MultipleTreesRenderer>
          </ZoomContainer>
        </svg>
        <ClickAwayListener
          onClickAway={this.handleCloseMenu}
          mouseEvent="onClick"
          touchEvent="onTouchStart"
        >
          <Paper
            id="contextMenu"
            style={{
              position: "absolute",
              left: this.state.addMenuX + "px",
              top: this.state.addMenuY + "px",

              display: this.state.isAddMenuOpen ? "" : "none",
            }}
          >
            <MenuList>
              <MenuItem>Add parent</MenuItem>
              <MenuItem>Connect parent</MenuItem>
              <MenuItem>Add child</MenuItem>
              <MenuItem onClick={this.handleConnectChild}>
                Connect child
              </MenuItem>
            </MenuList>
          </Paper>
        </ClickAwayListener>
      </div>
    );
  }
  componentDidMount() {
    document.addEventListener("mousedown", this.handleCloseMenu);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleCloseMenu);
  }
}

export function useSvg() {
  return React.useContext(Context);
}

export default TreeContainer;
