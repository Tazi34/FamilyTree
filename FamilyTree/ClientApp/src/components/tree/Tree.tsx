import { Paper, Theme, withStyles } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { Redirect, withRouter } from "react-router";
import { compose } from "recompose";
import { HOME_PAGE_URI } from "../../applicationRouting";
import { RECT_HEIGHT, RECT_WIDTH } from "../../d3/RectMapper";
import { ApplicationState } from "../../helpers";
import CreateNodeDialog, {
  CreateNodeFormData,
} from "../addNodeActionDialog/CreateNodeDialog";
import { withAlertMessage } from "../alerts/withAlert";
import { sendInvitation } from "../invitation/reducer/invitationsReducer";
import TreeInformationContainer from "../treeInformation/TreeInformationContainer";
import { ConnectNodesRequestData } from "./API/connectNodes/connectNodesRequest";
import { ConnectPartnersRequestData } from "./API/connectNodes/connectPartnerRequest";
import { CreateNodeRequestData } from "./API/createNode/createNodeRequest";
import { FamilyNode } from "./model/FamilyNode";
import { PersonNode } from "./model/PersonNode";
import { Point } from "./Point";
import {
  addEmptyNode,
  changeTreeName,
  changeTreeVisibility,
  exportTree,
  fetchTree,
} from "./reducer/treeReducer";
import { connectNodes } from "./reducer/updateNodes/connectChildWithNodes";
import { connectPartners } from "./reducer/updateNodes/connectPartners";
import { requestDisconnectNode } from "./reducer/updateNodes/disconnectNodes";
import { hideBranch } from "./reducer/updateNodes/hideBranch";
import TreeRenderer from "./TreeRenderer";

const PanZoom = require("react-easy-panzoom").default;
type TreeContainerState = {
  addDialog: boolean;
  scale: number;
  canvasWidth: number;
  canvasHeight: number;
  positionX: number;
  positionY: number;
  maxScale: number;
  maxX: number;
  maxY: number;
  minX: number;
  minY: number;
};
const styles = (theme: Theme) => ({
  treeInformationPanel: {
    width: "100%",
    background: "#fafafa",
  } as any,
  relative: {
    position: "relative",
  } as any,
  treeBackground: {
    width: "100%",
    height: "100%",
    background: "#C7C7BB",
    display: "flex",
    flexDirection: "column",
  } as any,
  root: {
    width: "100%",
    height: "100%",
  },
  treeCanvas: {
    flexGrow: 1,
    width: "100%",
  },
});

class Tree extends React.Component<any, TreeContainerState> {
  private panRef: React.RefObject<any>;
  constructor(props: any) {
    super(props);

    this.state = {
      scale: 1,
      addDialog: false,
      canvasWidth: 0,
      canvasHeight: 0,
      positionX: 0,
      positionY: 0,
      maxScale: 5,
      maxX: 3000,
      maxY: 3000,
      minX: -3000,
      minY: -3000,
    };
    this.panRef = React.createRef();
  }

  handleConnectStart = () => {};

  setTransform = (x: number, y: number, scale: number) => {
    this.setState({ positionX: x, positionY: y, scale });
  };
  componentDidMount() {
    const treeId = this.props.computedMatch.params.treeId;
    //TODO rozwiazanie kwesti goscia - jak wejdzie gosc rzuca blad i elo
    this.props.getTree(treeId).then((resp: any) => {
      if (resp.error) {
        this.props.history.push(HOME_PAGE_URI);
      } else {
        const nodes: PersonNode[] = resp.payload.data.nodes;
        const maxX = Math.max(...nodes.map((n) => n.x));
        const maxY = Math.max(...nodes.map((n) => n.y));
        const minX = Math.min(...nodes.map((n) => n.x));
        const minY = Math.min(...nodes.map((n) => n.y));
        const width = maxX - minX;
        const height = maxY - minY;
        const widthScale = this.state.canvasWidth / width;
        const heightScale = this.state.canvasHeight / height;

        this.setState({
          positionX: minX + width / 2,
          positionY: minY + height / 2,
          scale: Math.max(widthScale, heightScale),
        });

        let scale = Math.min(widthScale, heightScale);
        scale = scale < 1 ? scale : 1;

        this.panRef?.current.setState({
          x: -scale * (minX + width / 2) + this.state.canvasWidth / 2,
          y: -scale * (minY + height / 2) + this.state.canvasHeight / 2,
          scale: scale,
        });
        this.setState({ maxScale: scale + 1 < 5 ? 5 : scale + 1 });
      }
    });

    this.resetDimensions();

    window.addEventListener("resize", this.resetDimensions);
  }

  resetDimensions = () => {
    var canvasContainer = document.getElementById("tree-canvas");
    if (canvasContainer) {
      this.setState({
        canvasWidth: canvasContainer.offsetWidth,
        canvasHeight: canvasContainer.offsetHeight,
      });
    }
  };
  componentDidUpdate(prevProps: any) {
    if (
      this.props.computedMatch.params.treeId !=
      prevProps.computedMatch.params.treeId
    ) {
      const treeId = this.props.computedMatch.params.treeId;
      this.props.getTree(treeId);
    }
  }
  getScreenCenter = (): Point => {
    return {
      x:
        -this.state.positionX + (this.state.canvasWidth / 2) * this.state.scale,
      y:
        -this.state.positionY +
        (this.state.canvasHeight / 2) * this.state.scale,
    };
  };
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.closeAddNodeDialog);
    window.removeEventListener("resize", this.resetDimensions);
  }

  handleAddNode = (formData: CreateNodeFormData) => {
    const screenCenter = this.getScreenCenter();
    var createNodeData: CreateNodeRequestData = {
      ...formData,
      userId: 0,
      fatherId: 0,
      motherId: 0,
      children: [],
      partners: [],
      x: screenCenter.x,
      y: screenCenter.y,
      picture: formData.picture,
      treeId: parseFloat(this.props.computedMatch.params.treeId),
    };
    this.props.addEmptyNode(createNodeData).then((resp: any) => {
      if (resp.error) {
        this.props.alertError("Error creating family member. Try again later.");
      } else {
        this.props.alertSuccess("Family member created sucessfully.");
        this.closeAddNodeDialog();
      }
    });
  };

  handleDefaultAddNode = () => {
    const createNodeData: CreateNodeRequestData = {
      userId: 0,
      treeId: this.props.treeInformation.treeId,
      children: [],
      fatherId: 0,
      motherId: 0,
      picture: "",
      description: "Very fascinating description :0",
      name: "Adam",
      sex: "Male",
      x:
        -this.state.positionX / this.state.scale +
        this.state.canvasWidth / 2 / this.state.scale,
      y:
        -this.state.positionY / this.state.scale +
        this.state.canvasHeight / 2 / this.state.scale,
      surname: "Kowalski",
      birthday: "2020-12-16T20:29:42.677Z",
      partners: [],
    };
    this.props.addEmptyNode(createNodeData);
  };

  handleDisconnectNode = (node: PersonNode) => {
    this.props.requestDisconnectNode([node.id]);
  };
  handleConnectAsChild = (
    childNode: number,
    parentNode: number,
    secondParentNode?: number
  ) => {
    const treeId = parseFloat(this.props.computedMatch.params.treeId);

    const data: ConnectNodesRequestData = {
      treeId: treeId,
      childId: childNode,
      firstParentId: parentNode,
      secondParentId: secondParentNode,
    };
    this.props.connectNodes(data);
  };

  handleConnectAsPartner = (firstPartner: number, secondPartner: number) => {
    const data: ConnectPartnersRequestData = {
      firstPartnerId: firstPartner,
      secondPartnerId: secondPartner,
    };
    this.props.connectPartners(data);
  };

  setScale = (e: any) => {
    this.setState({ scale: e.scale });
  };
  handleHideBranch = (family: FamilyNode) => {
    this.props.hideBranch({
      familyId: family.id,
      show: family.hidden,
      treeId: family.treeId,
    });

    const pan = this.panRef?.current;
    if (pan) {
      // const scale = pan.state.scale;
      // pan.setState({
      //   x: -family.x * scale + this.state.canvasWidth / 2,
      //   y: -family.y * scale + this.state.canvasHeight / 2,
      //   scale: scale,
      // });
    }

    // this.panRef?.current?.moveByRatio(
    //   -family.x - this.state.positionX + this.state.canvasWidth / 2,
    //   -family.y - this.state.positionY + this.state.canvasHeight / 2 - 100,
    //   0.0009775
    //);
  };
  openAddNodeDialog = () => this.setState({ addDialog: true });
  closeAddNodeDialog = () => {
    if (this.state.addDialog) {
      this.setState({ addDialog: false });
    }
  };
  render() {
    const { classes } = this.props;

    if (this.props.isLoading)
      return <div className={classes.treeBackground}></div>;

    if (this.props.treeInformation && this.props.treeInformation.treeId == 0) {
      return <Redirect to={HOME_PAGE_URI} />;
    }

    return (
      <Paper className={classes.root}>
        <div className={classes.treeBackground}>
          <div className={classes.relative}>
            <div className={classes.treeInformationPanel}>
              <TreeInformationContainer
                onMockAddNode={this.handleDefaultAddNode}
                onNodeAdd={this.openAddNodeDialog}
              />
            </div>
          </div>

          <div id="tree-canvas" className={classes.treeCanvas}>
            <PanZoom
              ref={this.panRef}
              style={{ width: "100%", height: "100%", overflow: "hidden" }}
              onStateChange={(e: any) => {
                this.setTransform(e.x, e.y, e.scale);
              }}
              boundaryRatioVertical={1}
              boundaryRatioHorizontal={1}
            >
              <TreeRenderer
                onDisconnectNode={this.handleDisconnectNode}
                onHideBranch={this.handleHideBranch}
                scale={this.state.scale}
                onConnectAsChild={this.handleConnectAsChild}
                onConnectAsPartner={this.handleConnectAsPartner}
                rectHeight={RECT_HEIGHT}
                rectWidth={RECT_WIDTH}
                positionX={this.state.positionX}
                positionY={this.state.positionY}
                onSuccess={this.props.alertSuccess}
                onError={this.props.alertError}
              />
            </PanZoom>
          </div>
        </div>
        <CreateNodeDialog
          onSubmit={this.handleAddNode}
          open={this.state.addDialog}
          onClose={this.closeAddNodeDialog}
        />
      </Paper>
    );
  }
}

const mapDispatch = {
  getTree: fetchTree,
  changeTreeName,
  changeTreeVisibility,
  addEmptyNode,
  sendInvitation,
  connectNodes,
  connectPartners,
  hideBranch,
  requestDisconnectNode,
  exportTree,
};
const mapState = (state: ApplicationState) => ({
  isLoading: state.tree.isLoading,
  user: state.authentication.user,
  treeInformation: state.tree.treeInformation,
});

export default compose(
  withRouter,
  withStyles(styles),
  withAlertMessage,
  connect(mapState, mapDispatch)
)(Tree);
