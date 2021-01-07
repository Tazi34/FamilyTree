import { Button, Paper, Theme, withStyles } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { Redirect, withRouter } from "react-router";
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
import { hideBranch } from "./reducer/updateNodes/hideBranch";

import { connectPartners } from "./reducer/updateNodes/connectPartners";
import TreeInformationPanel from "./TreeInformationPanel";
import TreeRenderer from "./TreeRenderer";
import CreateNodeDialog, {
  CreateNodeFormData,
} from "../addNodeActionDialog/CreateNodeDialog";
import { withAlertMessage } from "../alerts/withAlert";
import { HOME_PAGE_URI } from "../../applicationRouting";
import { FamilyNode } from "./model/FamilyNode";
import { PersonNode } from "./model/PersonNode";

type TreeContainerState = {
  addDialog: boolean;
  scale: number;
  canvasWidth: number;
  canvasHeight: number;
  positionX: number;
  positionY: number;
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
      positionX: 0,
      positionY: 0,
    };
    this.svgRef = React.createRef();
  }

  getSvg = () => {
    return this.svgRef.current;
  };
  handleConnectStart = () => {};

  setTransform = (x: number, y: number, scale: number) => {
    this.setState({ positionX: x, positionY: y, scale });
  };
  componentDidMount() {
    const treeId = this.props.computedMatch.params.treeId;
    //TODO rozwiazanie kwesti goscia - jak wejdzie gosc rzuca blad i elo
    this.props.getTree(treeId).then((resp: any) => {
      if (resp.error) {
        this.props.history.goBack();
      } else {
        const nodes: PersonNode[] = resp.payload.data.nodes;
        const maxX = Math.max(...nodes.map((n) => n.x));
        const maxY = Math.max(...nodes.map((n) => n.y));
        const minX = Math.min(...nodes.map((n) => n.x));
        const minY = Math.min(...nodes.map((n) => n.y));
        const width = maxX - minX + 400;
        const height = maxY - minY + 400;
        const widthScale = this.state.canvasWidth / width;
        const heightScale = this.state.canvasHeight / height;
        this.setState({
          positionX: minX,
          positionY: minY,
        });
      }
    });

    this.resetDimensions();

    window.addEventListener("resize", this.resetDimensions);
  }

  resetDimensions = () => {
    var canvasContainer = document.getElementById("tree-canvas");
    if (canvasContainer) {
      this.setState({
        canvasWidth: canvasContainer.clientWidth,
        canvasHeight: canvasContainer.clientHeight,
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

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleCloseMenu);
    window.removeEventListener("resize", this.resetDimensions);
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
      picture: formData.picture,
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
      picture: "",
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
    this.props.sendInvitation(data).then((resp: any) => {
      if (!resp.error) {
        this.props.alertSuccess("User invited");
      }
    });
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
  handleSiblingAdd = (id: number, data: CreateNodeRequestData) => {
    this.props.addSibling(id, data);
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
  };

  moveCanvas = (x: number, y: number) => {};

  render() {
    const { classes, treeInformation } = this.props;

    if (this.props.isLoading)
      return <div className={classes.treeBackground}></div>;

    if (this.props.treeInformation && this.props.treeInformation.treeId == 0) {
      return <Redirect to={HOME_PAGE_URI} />;
    }

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
                onAddMockNode={this.handleDefaultAddNode}
                onAddNode={() => this.setState({ addDialog: true })}
              />
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

                minScale: 0.5,
                maxScale: 1.4,
              }}
              // onZoomChange={(e: any) => {
              //   console.log(e);
              //   //this.setTransform(e.positionX, e.positionY, e.scale);
              // }}
              // onPanning={(e: any) => {
              //   this.setTransform(e.positionX, e.positionY,1);
              // }}
              // onPinching={(e: any) => {
              //   this.setTransform(e.positionX, e.positionY, 1);
              // }}
              defaultPositionX={this.state.positionX}
              defaultPositionY={this.state.positionY}
            >
              {({
                zoomIn,
                zoomOut,
                resetTransform,
                scale,
                positionX,
                positionY,
                setPositionX,
                setPositionY,
                setScale,
                setTransform,
                ...rest
              }: any) => (
                <TransformComponent>
                  <TreeRenderer
                    onHideBranch={this.handleHideBranch}
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
                    onSuccess={this.props.alertSuccess}
                    onError={this.props.alertError}
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
  hideBranch,
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
