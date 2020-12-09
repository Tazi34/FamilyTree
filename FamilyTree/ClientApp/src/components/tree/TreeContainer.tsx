import {
  ClickAwayListener,
  MenuItem,
  MenuList,
  Paper,
} from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { RECT_HEIGHT, RECT_WIDTH } from "../../d3/RectMapper";
import { ApplicationState } from "../../helpers";
import data2 from "../../samples/complex.json";
import {
  getTree,
  selectAllFamilies,
  selectAllLinks,
  selectAllNodes,
} from "./treeReducer";
import TreeRenderer from "./TreeRenderer";
import { ZoomContainer } from "./Zoom";

type TreeContainerState = {
  familyTreeEntries: any;
  isAddMenuOpen: boolean;
  addMenuX: number;
  addMenuY: number;
};

class TreeContainer extends React.Component<any, TreeContainerState> {
  private svgRef: React.RefObject<any>;

  constructor(props: any) {
    super(props);

    this.state = {
      addMenuX: 0,
      addMenuY: 0,
      isAddMenuOpen: false,
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
  componentDidMount() {
    this.props.getTree(1);

    document.addEventListener("mousedown", this.handleCloseMenu);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleCloseMenu);
  }
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
    if (this.props.isLoading) return null;

    return (
      <div style={{ width: "100%", height: "100%" }}>
        <svg ref={this.svgRef} width={"100%"} height={"100%"}>
          <ZoomContainer
            getSvg={this.getSvg}
            onMouseMove={this.handleCloseMenu}
          >
            <TreeRenderer
              nodes={this.props.nodes}
              links={this.props.links}
              families={this.props.families}
              onAddMenuOpen={this.handleNodeAdd}
              onAddNodeMenuClose={this.handleCloseMenu}
              rectHeight={RECT_HEIGHT}
              rectWidth={RECT_WIDTH}
            ></TreeRenderer>
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
}

const mapDispatch = {
  getTree,
};
const mapState = (state: ApplicationState) => ({
  nodes: selectAllNodes(state),
  isLoading: state.tree.isLoading,
  families: selectAllFamilies(state),
  links: selectAllLinks(state),
});

export default connect(mapState, mapDispatch)(TreeContainer);
