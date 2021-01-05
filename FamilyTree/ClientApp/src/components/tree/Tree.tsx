import { Button, Paper, Theme, withStyles } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { compose } from "recompose";
import { RECT_HEIGHT, RECT_WIDTH } from "../../d3/RectMapper";
import { ApplicationState } from "../../helpers";
import { TreeInformation } from "../../model/TreeInformation";
import { SendInvitationRequestData } from "../invitation/API/sendInvitation/sendInvitationRequest";
import { sendInvitation } from "../invitation/reducer/invitationsReducer";
import { ConnectNodesRequestData } from "./API/connectNodes/connectNodesRequest";
import { ConnectPartnersRequestData } from "./API/connectNodes/connectPartnerRequest";
import { CreateNodeRequestData } from "./API/createNode/createNodeRequest";
import {
  addEmptyNode,
  changeTreeName,
  changeTreeVisibility,
  getTree,
} from "./reducer/treeReducer";
import { addChild } from "./reducer/updateNodes/addChild";
import { addParentAsync2 } from "./reducer/updateNodes/addParent";
import { addPartner } from "./reducer/updateNodes/addPartner";
import { addSiblingRequest } from "./reducer/updateNodes/addSibling";
import { connectNodes } from "./reducer/updateNodes/connectChildWithNodes";
import { connectPartners } from "./reducer/updateNodes/connectPartners";
import TreeInformationPanel from "./TreeInformationPanel";
import TreeRenderer from "./TreeRenderer";
import CreateNodeDialog, {
  CreateNodeFormData,
} from "../addNodeActionDialog/CreateNodeDialog";
import { withAlertMessage } from "../alerts/withAlert";

type TreeContainerState = {
  addDialog: boolean;
  scale: number;
  canvasWidth: number;
  canvasHeight: number;
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
    background: "radial-gradient(#e0e0e0,grey)",
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
  private svgRef: React.RefObject<any>;

  constructor(props: any) {
    super(props);

    this.state = {
      scale: 1,
      addDialog: false,
      canvasWidth: 0,
      canvasHeight: 0,
    };
    this.svgRef = React.createRef();
  }

  getSvg = () => {
    return this.svgRef.current;
  };
  handleConnectStart = () => {};

  componentDidMount() {
    const treeId = this.props.computedMatch.params.treeId;
    //TODO rozwiazanie kwesti goscia - jak wejdzie gosc rzuca blad i elo
    this.props.getTree(treeId).then((resp: any) => {
      // if (resp.error) {
      //   this.props.history.back();
      // }
    });

    this.resetDimensions();
    const canvas = document.getElementById("tree-canvas") as HTMLElement;
    canvas.addEventListener("resize", this.resetDimensions);
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

  handleCloseMenu = () => {
    if (this.state.addDialog) {
      this.setState({ addDialog: false });
    }
  };
  handlePartnerAdd = (id: number, data: CreateNodeRequestData) => {
    this.props.addPartner(id, data);
  };

  handleTreeNameChange = (
    treeInformation: TreeInformation,
    newName: string
  ) => {
    this.props.changeTreeName({ ...treeInformation, name: newName });
  };
  handleTreeVisibilityChange = (treeInformation: TreeInformation) => {
    this.props.changeTreeVisibility(treeInformation);
  };
  handleAddNode = (formData: CreateNodeFormData) => {
    var createNodeData: CreateNodeRequestData = {
      ...formData,
      userId: 0,
      fatherId: 0,
      motherId: 0,
      children: [],
      partners: [],
      x: 0,
      y: 0,
      treeId: parseFloat(this.props.computedMatch.params.treeId),
    };
    this.props.addEmptyNode(createNodeData).then((resp: any) => {
      if (resp.error) {
        this.props.alertError("Error creating family member. Try again later.");
      } else {
        this.props.alertSuccess("Family member created sucessfully.");
        this.handleCloseMenu();
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

  handleInviteUserToTree = (userId: number) => {
    const treeId = parseFloat(this.props.computedMatch.params.treeId);
    const data: SendInvitationRequestData = {
      hostUserId: this.props.user.id,
      askedUserId: userId,
      treeId,
    };
    this.props.sendInvitation(data);
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
    const treeId = parseFloat(this.props.computedMatch.params.treeId);

    const data: ConnectPartnersRequestData = {
      firstPartnerId: firstPartner,
      secondPartnerId: secondPartner,
    };
    this.props.connectPartners(data);
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
                onInviteUser={this.handleInviteUserToTree}
              />
              <Button onClick={() => this.setState({ addDialog: true })}>
                Add Node
              </Button>
              <Button onClick={this.handleDefaultAddNode}>Add mock Node</Button>
            </div>
          </div>

          <div
            id="tree-canvas"
            ref={this.svgRef}
            className={classes.treeCanvas}
          >
            <TransformWrapper
              options={{
                limitToBounds: false,
                centerContent: true,
                minScale: 0.4,
                maxScale: 1.4,
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
                    onConnectAsChild={this.handleConnectAsChild}
                    onConnectAsPartner={this.handleConnectAsPartner}
                    rectHeight={RECT_HEIGHT}
                    rectWidth={RECT_WIDTH}
                    positionX={positionX}
                    positionY={positionY}
                  />
                </TransformComponent>
              )}
            </TransformWrapper>
          </div>
        </div>
        <CreateNodeDialog
          onSubmit={this.handleAddNode}
          open={this.state.addDialog}
          onClose={this.handleCloseMenu}
        />
      </Paper>
    );
  }
}

const mapDispatch = {
  getTree,
  changeTreeName,
  changeTreeVisibility,
  addEmptyNode,
  addParentAsync2,
  addPartner,
  addChild,
  addSibling: addSiblingRequest,
  sendInvitation,
  connectNodes,
  connectPartners,
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
