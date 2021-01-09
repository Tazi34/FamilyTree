import { Fade } from "@material-ui/core";
import { EntityId } from "@reduxjs/toolkit";
import Axios from "axios";
import React from "react";
import { connect } from "react-redux";
import { ApplicationState } from "../../helpers";
import { baseURL } from "../../helpers/apiHelpers";
import { CreateNodeRequestData } from "./API/createNode/createNodeRequest";
import Families from "./Families";
import FollowableLink from "./FollowableLink";
import { createPath } from "./helpers/linkCreationHelpers";
import { LinkLoaded } from "./LinkComponent";
import Links from "./Links";
import { FamilyNode, getFamilyLocation } from "./model/FamilyNode";
import { Link } from "./model/Link";
import { Node } from "./model/NodeClass";
import { PersonNode } from "./model/PersonNode";
import NodesList from "./NodesList";
import { Point } from "./Point";
import {
  linkLoader,
  selectAllFamilies,
  selectAllLinks,
  selectAllPersonNodes,
  TreeState,
} from "./reducer/treeReducer";
import { changeNodeVisibility } from "./reducer/updateNodes/changeNodeVisibility";

import { requestDeleteNode } from "./reducer/updateNodes/deleteNode";
import { moveNode, moveNodeThunk } from "./reducer/updateNodes/moveNode";
import {
  getIncomingLinks,
  getNodeById,
  getOutboundLinks,
} from "./reducer/utils/getOutboundLinks";
import TreeNodeDetailsDialog from "./TreeNodeDetailsDialog";
import "./treeRenderer.css";

const d3_base = require("d3");
const d3_dag = require("d3-dag");
const d3 = Object.assign({}, d3_base, d3_dag);

const nodesGroupId = "nodes_group";
const linksGroupId = "links_group";
//TODO PRZENIESC
export interface IDictionary<TValue> {
  [id: string]: TValue;
}

type OwnProps = {
  rectWidth: number;
  rectHeight: number;
  onParentAdd: (id: number, data: CreateNodeRequestData) => void;
  onPartnerAdd: (id: number, data: CreateNodeRequestData) => void;
  onSiblingAdd: (id: number, data: CreateNodeRequestData) => void;
  onHideBranch: (family: FamilyNode) => void;
  onSuccess: any;
  onError: any;
  onChildAdd: (
    data: CreateNodeRequestData,
    firstParent: number,
    secondParent?: number
  ) => void;
  [x: string]: any;
  scale: number;

  canvasRef: any;
};
type DispatchProps = {
  moveNodeThunk: any;
  treeState: TreeState;
  moveNode: any;
  links: Link[];
  families: FamilyNode[];
  nodes: PersonNode[];
  requestDeleteNode: any;
};

type Props = DispatchProps & OwnProps;
export type ConnectionMode = "AsChild" | "AsPartner" | "AsParent";
type ConnectionProps = {
  isConnecting: boolean;
  start: PersonNode | null;
  mode: ConnectionMode | null;
  possibleConnections: {
    nodes: number[];
    families: EntityId[];
  };
  firstTarget: PersonNode | null;
};
type NodeDialogProps = {
  open: boolean;
  node: PersonNode | null;
  startOnEdit?: boolean;
};
type AddActionDialogProps = {
  open: boolean;
  node: PersonNode | null;
};
type State = {
  nodeDialog: NodeDialogProps;
  connection: ConnectionProps;
  addActionDialog: AddActionDialogProps;
};

class TreeRenderer extends React.Component<Props, State, any> {
  private ref: any;
  constructor(props: Props) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      nodeDialog: {
        open: false,
        node: null,
      },
      connection: {
        isConnecting: false,
        start: null,
        possibleConnections: {
          families: [],
          nodes: [],
        },
        mode: null,
        firstTarget: null,
      },
      addActionDialog: {
        open: false,
        node: null,
      },
    };
  }
  resetConnectingMode = () => {
    this.setState({
      connection: {
        firstTarget: null,
        isConnecting: false,
        possibleConnections: {
          families: [],
          nodes: [],
        },
        mode: null,
        start: null,
      },
    });
  };

  openAddActionDialog = (node: PersonNode) => {
    this.setState({
      addActionDialog: {
        open: true,
        node: node,
      },
    });
  };
  resetAddActionDialog = () => {
    this.setState({
      addActionDialog: {
        open: false,
        node: null,
      },
    });
  };

  componentDidMount = () => {
    document.oncontextmenu = (e: any) => {
      if (this.state.connection.isConnecting) {
        e.preventDefault();
        this.resetConnectingMode();
        return false;
      }
    };
  };
  componentWillUnmount = () => {
    document.oncontextmenu = null;
  };
  handleNodeDelete = (id: number) => {
    this.props.requestDeleteNode(id);
  };
  handlePartnerAdd = (id: number, data: CreateNodeRequestData) => {
    this.props.onPartnerAdd(id, data);
  };
  handleParentAdd = (id: number, data: CreateNodeRequestData) => {
    this.props.onParentAdd(id, data);
  };
  handleNodeMove = (node: Node, x: number, y: number) => {
    this.props.moveNode(node, x, y);
    this.props.moveNodeThunk({ nodeId: node.id as number, x, y });
  };
  moveNodeOnCanvas = (e: any, node: Node) => {
    if (this.state.connection.isConnecting) {
      return;
    }
    const treeState = this.props.treeState;

    const nodeFamilies = this.props.families.filter(
      (family) => family.fatherId === node.id || family.motherId === node.id
    );

    nodeFamilies.forEach((family) => {
      var familyLocation: Point;

      if (family.fatherId && family.motherId) {
        const nodeToLoadId =
          family.fatherId === node.id ? family.motherId : family.fatherId;
        const otherNode = this.props.nodes.find(
          (n) => n.id === nodeToLoadId
        ) as PersonNode;
        familyLocation = getFamilyLocation(
          family,
          { x: e.x, y: e.y },
          otherNode
        );
      } else {
        familyLocation = getFamilyLocation(family, { x: e.x, y: e.y });
      }
      const familyNode = d3.select("#" + family.id);
      familyNode.style(
        "transform",
        `translate(${familyLocation.x - 10}px,${familyLocation.y - 10}px)`
      );

      //Przesun wszystkie polaczenia rodziny
      const familyLinks = getOutboundLinks(treeState, family);
      familyLinks.forEach((link: Link) => {
        const otherNodelocation = getNodeById(treeState, link.target);
        let path: any;
        if (otherNodelocation) {
          if (otherNodelocation.id === node.id) {
            path = createPath(familyLocation.x, familyLocation.y, e.x, e.y);
          } else {
            path = createPath(
              familyLocation.x,
              familyLocation.y,
              otherNodelocation.x,
              otherNodelocation.y
            );
          }

          const linksvg = d3.select("#" + link.id);
          linksvg.attr("d", path);
        }
      });
      const familyIncomingLinks = getIncomingLinks(treeState, family);

      familyIncomingLinks.forEach((link: Link) => {
        const otherNodelocation = getNodeById(treeState, link.source);
        if (otherNodelocation) {
          let path: any;
          if (otherNodelocation.id === node.id) {
            path = createPath(e.x, e.y, familyLocation.x, familyLocation.y);
          } else {
            path = createPath(
              otherNodelocation.x,
              otherNodelocation.y,
              familyLocation.x,
              familyLocation.y
            );
          }
          const linksvg = d3.select("#" + link.id);
          linksvg.attr("d", path);
        }
      });
    });

    const outbondLinks = getOutboundLinks(treeState, node);

    outbondLinks
      .filter(
        (link) => !nodeFamilies.find((family) => link.target === family.id)
      )
      .forEach((link: Link) => {
        const otherNodelocation = getNodeById(treeState, link.target);
        if (otherNodelocation) {
          var path = createPath(
            e.x,
            e.y,
            otherNodelocation.x,
            otherNodelocation.y
          );
          console.log(link);

          const linksvg = d3.select("#" + link.id);
          linksvg.attr("d", path);
        }
      });
    const incomingLinks = getIncomingLinks(treeState, node);

    incomingLinks.forEach((link: Link) => {
      const otherNodelocation = getNodeById(treeState, link.source);
      if (otherNodelocation) {
        var path = createPath(
          otherNodelocation.x,
          otherNodelocation.y,
          e.x,
          e.y
        );
        const linksvg = d3.select("#" + link.id);
        linksvg.attr("d", path);
      }
    });
  };
  traverseTree = (node: Node, callback: Function) => {
    //traverseRec(node, callback, 0, (id: number) => getNodeById(treeState, id));
  };
  handleNodeVisibilityChange = (node: PersonNode) => {
    this.props.onNodeVisiblityChange(node);
  };

  addFirstTargetToConnection = (node: PersonNode) => {
    this.setState({
      connection: {
        ...this.state.connection,
        firstTarget: node,
      },
    });
  };
  handleFamilySelect = (familyNode: FamilyNode, event: any) => {
    const connectionMode = this.state.connection;
    if (connectionMode.isConnecting) {
      if (connectionMode.possibleConnections.families.includes(familyNode.id)) {
        this.props.onConnectAsChild(
          this.state.connection.start!.id,
          familyNode.fatherId,
          familyNode.motherId
        );
        this.resetConnectingMode();
      }
    } else {
      this.props.onHideBranch(familyNode);
    }
  };
  handleNodeSelect = (personNode: PersonNode) => {
    const connectionMode = this.state.connection;
    if (connectionMode.isConnecting) {
      if (
        connectionMode.possibleConnections.nodes.includes(
          personNode.id as number
        )
      ) {
        if (connectionMode.mode === "AsChild") {
          const startNode = connectionMode.start;
          if (!startNode || (startNode.fatherId && startNode.motherId)) {
            this.resetConnectingMode();
            return;
          }
          var existingParent = startNode.fatherId ?? startNode.motherId;

          this.props.onConnectAsChild(
            connectionMode.start!.id,
            personNode.id,
            existingParent
          );
        }
        if (connectionMode.mode === "AsPartner") {
          this.props.onConnectAsPartner(
            this.state.connection.start!.id,
            personNode.id
          );
        }
        if (connectionMode.mode === "AsParent") {
          const startNode = connectionMode.start;
          if (!startNode || (startNode.fatherId && startNode.motherId)) {
            this.resetConnectingMode();
            return;
          }
          var existingParent = personNode.fatherId ?? personNode.motherId;

          this.props.onConnectAsChild(
            personNode.id,
            connectionMode.start!.id,
            existingParent
          );
        }
      }
      this.resetConnectingMode();
    } else {
      this.setState({ nodeDialog: { open: true, node: personNode } });
    }
  };
  handleDialogClose = () => {
    this.setState({ nodeDialog: { open: false, node: null } });
  };
  handleConnectStart = (node: PersonNode, mode: ConnectionMode) => {
    Axios.post(baseURL + "/tree/node/possibleConnections", {
      mode: mode,
      nodeId: node.id,
    }).then((resp) => {
      this.setState({
        connection: {
          firstTarget: this.state.connection.firstTarget,
          isConnecting: true,
          start: node,
          possibleConnections: resp.data,
          mode,
        },
      });
    });
  };

  handleChildAdd = (
    data: CreateNodeRequestData,
    firstParent: number,
    secondParent?: number
  ) => {
    if (this.state.connection.isConnecting) {
      return;
    }
    this.props.onChildAdd(data, firstParent, secondParent);
  };
  render = () => {
    const { nodeDialog } = this.state;

    const loadedLinks = this.props.links
      .map((link: Link) => linkLoader(this.props.treeState, link))
      .filter((a: any) => a) as LinkLoaded[];

    return (
      <Fade in={true} timeout={3000}>
        <div>
          {/* <div> */}
          <NodesList
            onNodeVisiblityChange={this.props.changeNodeVisibility}
            onDisconnectNode={this.props.onDisconnectNode}
            // positionX={this.props.positionX}
            // positionY={this.props.positionY}
            // canvasWidth={this.props.canvasWidth}
            // canvasHeight={this.props.canvasHeight}
            possibleConnections={
              this.state.connection.possibleConnections.nodes
            }
            disabled={this.state.connection.isConnecting}
            onConnectStart={this.handleConnectStart}
            onSiblingAdd={this.props.onSiblingAdd}
            onChildAdd={this.props.onChildAdd}
            viewRef={this.props.canvasRef}
            scale={this.props.scale}
            nodes={this.props.nodes}
            onNodeSelect={this.handleNodeSelect}
            onNodeMove={this.handleNodeMove}
            onParentAdd={this.handleParentAdd}
            onPartnerAdd={this.handlePartnerAdd}
            onNodeDelete={this.handleNodeDelete}
            onMoveNodeOnCanvas={this.moveNodeOnCanvas}
            onAddActionMenuClick={this.openAddActionDialog}
          />
          <Families
            isConnecting={this.state.connection.isConnecting}
            possibleConnections={
              this.state.connection.possibleConnections.families
            }
            families={this.props.families}
            onSelect={this.handleFamilySelect}
          />
          <Links links={loadedLinks}>
            <FollowableLink
              enabled={this.state.connection.isConnecting}
              positionX={this.props.positionX}
              positionY={this.props.positionY}
              scale={this.props.scale}
              source={this.state.connection.start ?? { x: 1, y: 1 }}
            />
          </Links>

          <div>
            <TreeNodeDetailsDialog
              //TODO na podstawie nodea
              startOnEdit={nodeDialog.startOnEdit}
              open={nodeDialog.open}
              node={nodeDialog.node}
              onClose={this.handleDialogClose}
              onSuccess={this.props.onSuccess}
              onError={this.props.onError}
            />
          </div>
        </div>
      </Fade>
    );
  };
}

const mapDispatch = {
  // getTree,
  // changeTreeName,
  // changeTreeVisibility,
  // addEmptyNode: addNode,
  // addParentAsync2,
  changeNodeVisibility,
  requestDeleteNode,
  moveNodeThunk,
  moveNode,
};
const mapState = (state: ApplicationState) => ({
  treeState: state.tree,
  families: selectAllFamilies(state),
  links: selectAllLinks(state),
  nodes: selectAllPersonNodes(state),
});

export default connect(mapState, mapDispatch)(TreeRenderer);

export const removeNodeFromFamily = (family: any, id: any) => {
  if (family.firstParent == id) {
    family.firstParent = null;
  } else if (family.secondParent == id) {
    family.secondParent = null;
  } else {
    family.children = family.children.filter((a: any) => a != id);
  }
};
//TODO przeniesc do innego pliku
export const traverseRec = (
  node: Node,
  callback: Function,
  depth: number,
  nodesSelector: Function
) => {
  callback(node, depth);

  const childrens = node.children
    .map((child) => nodesSelector(child))
    .filter((a) => a) as Node[];

  childrens.forEach((child) => {
    traverseRec(child, callback, ++depth, nodesSelector);
  });
};
