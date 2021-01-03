import { Button, Paper, Theme, withStyles } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import { RECT_HEIGHT, RECT_WIDTH } from "../../d3/RectMapper";
import { ApplicationState } from "../../helpers";
import { TreeInformation } from "../../model/TreeInformation";
import {
  changeTreeName,
  changeTreeVisibility,
} from "../userTreeList/usersTreeReducer";
import { CreateNodeRequestData } from "./API/createNode/createNodeRequest";
import { PersonNode } from "./model/PersonNode";
import { addPartner } from "./reducer/updateNodes/addPartner";
import { addChild } from "./reducer/updateNodes/addChild";
import { addSiblingRequest } from "./reducer/updateNodes/addSibling";

import {
  addNode,
  getTree,
  selectAllFamilies,
  selectAllLinks,
  selectAllPersonNodes,
} from "./reducer/treeReducer";
import { addParentAsync2 } from "./reducer/updateNodes/addParent";
import TreeInformationPanel from "./TreeInformationPanel";
import TreeRenderer from "./TreeRenderer";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

type TreeContainerState = {
  isAddMenuOpen: boolean;
  addMenuX: number;
  addMenuY: number;
  scale: number;
  canvasWidth: number;
  canvasHeight: number;
};
const styles = (theme: Theme) => ({
  treeInformationPanel: {
    top: 0,

    position: `absolute`,
  } as any,
  relative: {
    position: "relative",
  } as any,
  treeBackground: {
    width: "100%",
    height: "100%",
    background: "radial-gradient(#e0e0e0,grey)",
  },
  root: {
    width: "100%",
    height: "100%",
  },
});

class Tree extends React.Component<any, TreeContainerState> {
  private svgRef: React.RefObject<any>;

  constructor(props: any) {
    super(props);

    this.state = {
      scale: 1,
      addMenuX: 0,
      addMenuY: 0,
      isAddMenuOpen: false,
      canvasWidth: 0,
      canvasHeight: 0,
    };
    this.svgRef = React.createRef();
  }

  getSvg = () => {
    return this.svgRef.current;
  };

  componentDidMount() {
    const treeId = this.props.computedMatch.params.treeId;
    this.props.getTree(treeId);

    this.resetDimensions();
    const canvas = document.getElementById("tree-canvas") as HTMLElement;
    canvas.addEventListener("resize", this.resetDimensions);
    document.addEventListener("mousedown", this.handleCloseMenu);
  }
  resetDimensions() {
    var canvasContainer = this.svgRef.current;
    this.setState({
      canvasWidth: canvasContainer.clientWidth,
      canvasHeight: canvasContainer.clientHeight,
    });
  }
  componentDidUpdate(prevProps: any) {
    if (
      this.props.computedMatch.params.treeId !=
      prevProps.computedMatch.params.treeId
    ) {
      const treeId = this.props.computedMatch.params.treeId;
      this.props.getTree(treeId);
    }
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleCloseMenu);
  }

  handleCloseMenu = (e: any) => {
    if (this.state.isAddMenuOpen) {
      this.setState({ isAddMenuOpen: false });
    }
  };
  handlePartnerAdd = (id: number, data: CreateNodeRequestData) => {
    this.props.addPartner(id, data);
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
      description: "Very fascinating description :0",
      name: "Adam",
      sex: "Male",
      x: 0,
      y: 0,
      surname: "Kowalski",
      birthday: "2020-12-16T20:29:42.677Z",
      partners: [],
    };
    this.props.addEmptyNode(createNodeData);
  };

  handleParentAdd = (id: number, data: CreateNodeRequestData) => {
    this.props.addParentAsync2(id, data);
  };
  handleChildAdd = (
    data: CreateNodeRequestData,
    firstParentId: number,
    secondParentId?: number
  ) => {
    this.props.addChild(data, firstParentId, secondParentId);
  };

  handleSiblingAdd = (id: number, data: CreateNodeRequestData) => {
    this.props.addSibling(id, data);
  };
  setScale = (e: any) => {
    this.setState({ scale: e.scale });
  };

  render() {
    const { classes, treeInformation } = this.props;

    if (this.props.isLoading)
      return <div className={classes.treeBackground}></div>;

    console.log("RENDER TREE.tsx");
    return (
      <Paper className={classes.root}>
        <div className={classes.treeBackground}>
          <div className={classes.relative}>
            <div className={classes.treeInformationPanel}>
              <TreeInformationPanel
                treeInformation={treeInformation}
                onTreeNameChange={this.handleTreeNameChange}
                onTreeVisibilityChange={this.handleTreeVisibilityChange}
              />
              <Button onClick={this.handleAddNode}>Add Node</Button>
            </div>
          </div>

          <div
            id="tree-canvas"
            ref={this.svgRef}
            style={{ overflow: "hidden", width: "100%", height: "100%" }}
          >
            <TransformWrapper
              options={{
                limitToBounds: false,
                centerContent: true,
                minScale: 0.1,
              }}
              onWheelStop={this.setScale}
              defaultPositionX={this.state.canvasWidth / 2}
              defaultPositionY={this.state.canvasHeight / 2}
            >
              {({
                zoomIn,
                zoomOut,
                resetTransform,
                scale,
                positionX,
                positionY,
                ...rest
              }: any) => (
                <TransformComponent>
                  <TreeRenderer
                    canvasRef={this.svgRef}
                    scale={this.state.scale}
                    onParentAdd={this.handleParentAdd}
                    onPartnerAdd={this.handlePartnerAdd}
                    onChildAdd={this.handleChildAdd}
                    onSiblingAdd={this.handleSiblingAdd}
                    rectHeight={RECT_HEIGHT}
                    rectWidth={RECT_WIDTH}
                  />
                </TransformComponent>
              )}
            </TransformWrapper>
          </div>
        </div>
      </Paper>
    );
  }
}

const mapDispatch = {
  getTree,
  changeTreeName,
  changeTreeVisibility,
  addEmptyNode: addNode,
  addParentAsync2,
  addPartner,
  addChild,
  addSibling: addSiblingRequest,
};
const mapState = (state: ApplicationState) => ({
  isLoading: state.tree.isLoading,

  treeInformation: state.tree.treeInformation,
});

export default compose(
  withStyles(styles),
  connect(mapState, mapDispatch)
)(Tree);
