import {
  Button,
  ClickAwayListener,
  MenuItem,
  MenuList,
  Paper,
  Theme,
  withStyles,
} from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import { RECT_HEIGHT, RECT_WIDTH } from "../../d3/RectMapper";
import { ApplicationState } from "../../helpers";
import { TreeInformation } from "../../model/TreeInformation";
import {
  changeTreeName,
  changeTreeVisibility,
  usersTreesSelectors,
} from "../userTreeList/usersTreeReducer";
import { CreateNodeRequestData } from "./API/createNode/createNodeRequest";
import {
  addNode,
  getTree,
  selectAllFamilies,
  selectAllLinks,
  selectAllPersonNodes,
} from "./reducer/treeReducer";
import TreeInformationPanel from "./TreeInformationPanel";
import TreeRenderer from "./TreeRenderer";
import { ZoomContainer } from "./Zoom";

type TreeContainerState = {
  isAddMenuOpen: boolean;
  addMenuX: number;
  addMenuY: number;
};
const styles = (theme: Theme) => ({
  treeInformationPanel: {
    top: 0,
    left: 0,
    position: `relative`,
  } as any,
  treeBackground: {
    width: "100%",
    margin: "0 auto",
    height: "100%",
    background: "radial-gradient(#e0e0e0,grey)",
  },
});

class TreeContainer extends React.Component<any, TreeContainerState> {
  private svgRef: React.RefObject<any>;

  constructor(props: any) {
    super(props);

    this.state = {
      addMenuX: 0,
      addMenuY: 0,
      isAddMenuOpen: false,
    };
    this.svgRef = React.createRef();
  }

  getSvg = () => {
    return this.svgRef.current;
  };

  componentDidMount() {
    this.props.getTree(1);
    console.log(this.props);
    document.addEventListener("mousedown", this.handleCloseMenu);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleCloseMenu);
  }
  handleNodeAdd = (event: any) => {
    event.preventDefault();
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

  handleTreeNameChange = (
    treeInformation: TreeInformation,
    newName: string
  ) => {
    this.props.changeTreeName({ treeInformation, newName });
  };
  handleTreeVisibilityChange = (treeInformation: TreeInformation) => {
    this.props.changeTreeVisibility(treeInformation);
  };
  handleAddNode = () => {
    const createNodeData: CreateNodeRequestData = {
      userId: 0,
      treeId: this.props.treeInformation.treeId,
      children: [],
      fatherId: 0,
      motherId: 0,
      pictureUrl: "",
      description: "",
      name: "XD",
      surname: "Pablo",
      birthday: "2020-12-16T20:29:42.677Z",
      partners: [],
    };
    this.props.addEmptyNode(createNodeData);
  };

  render() {
    if (this.props.isLoading) return null;

    const { classes, treeInformation } = this.props;
    return (
      <div className={classes.treeBackground}>
        <div className={classes.treeInformationPanel}>
          <TreeInformationPanel
            treeInformation={treeInformation}
            onTreeNameChange={this.handleTreeNameChange}
            onTreeVisibilityChange={this.handleTreeVisibilityChange}
          />
          <Button onClick={this.handleAddNode}>Add Node</Button>
        </div>

        <svg id="tree-canvas" ref={this.svgRef} width={"100%"} height={"100%"}>
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
            {/* <MenuList>
              <MenuItem>Add parent</MenuItem>
              <MenuItem>Connect parent</MenuItem>
              <MenuItem>Add child</MenuItem>
              <MenuItem onClick={this.handleConnectChild}>
                Connect child
              </MenuItem>
            </MenuList> */}
          </Paper>
        </ClickAwayListener>
      </div>
    );
  }
}

const mapDispatch = {
  getTree,
  changeTreeName,
  changeTreeVisibility,
  addEmptyNode: addNode,
};
const mapState = (state: ApplicationState) => ({
  nodes: selectAllPersonNodes(state),
  isLoading: state.tree.isLoading,
  families: selectAllFamilies(state),
  links: selectAllLinks(state),

  treeInformation: state.tree.treeId
    ? usersTreesSelectors.selectById(state, state.tree!.treeId)
    : null,
});

export default compose(
  withStyles(styles),
  connect(mapState, mapDispatch)
)(TreeContainer);
