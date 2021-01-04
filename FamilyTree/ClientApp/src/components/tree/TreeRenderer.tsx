import { EntityId } from "@reduxjs/toolkit";
import React, { Profiler } from "react";
import { connect } from "react-redux";
import { ApplicationState } from "../../helpers";
import { CreateNodeRequestData } from "./API/createNode/createNodeRequest";
import Families from "./Families";
import FollowableLink from "./FollowableLink";
import { isGraphCyclic } from "./graphAlgorithms/cycleDetection";
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
import { connectNodes } from "./reducer/updateNodes/connectAsChild";
import { requestDeleteNode } from "./reducer/updateNodes/deleteNode";
import { moveNode, moveNodeThunk } from "./reducer/updateNodes/moveNode";
import {
  getIncomingLinks,
  getNodeById,
  getOutboundLinks,
  randomFamilyId,
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
type ConnectionProps = {
  isConnecting: boolean;
  start: PersonNode | null;
  possibleConnections: EntityId[];
  firstTarget: PersonNode | null;
};
type NodeDialogProps = {
  open: boolean;
  node: PersonNode | null;
};
type State = {
  nodeDialog: NodeDialogProps;
  connection: ConnectionProps;
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
        possibleConnections: [],
        firstTarget: null,
      },
    };
  }
  resetConnectingMode = () => {
    this.setState({
      connection: {
        firstTarget: null,
        isConnecting: false,
        possibleConnections: [],
        start: null,
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
        familyLocation = getFamilyLocation({ x: e.x, y: e.y }, otherNode);
      } else {
        familyLocation = getFamilyLocation({ x: e.x, y: e.y });
      }
      const familyNode = d3.select("#" + family.id);
      familyNode.style(
        "transform",
        `translate(${familyLocation.x}px,${familyLocation.y}px)`
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

  addFirstTargetToConnection = (node: PersonNode) => {
    this.setState({
      connection: {
        ...this.state.connection,
        firstTarget: node,
      },
    });
  };
  handleNodeSelect = (personNode: PersonNode) => {
    const connectionMode = this.state.connection;
    if (connectionMode.isConnecting) {
      if (!connectionMode.firstTarget && personNode.partners.length > 0) {
        this.addFirstTargetToConnection(personNode);
        return;
      }

      if (
        connectionMode.possibleConnections.includes(personNode.id as number)
      ) {
        this.props.onConnectAsChild(
          this.state.connection.start,
          personNode,
          connectionMode.firstTarget
        );
      }
      this.resetConnectingMode();
    } else {
      this.setState({ nodeDialog: { open: true, node: personNode } });
    }
  };
  handleDialogClose = () => {
    this.setState({ nodeDialog: { open: false, node: null } });
  };
  handleConnectStart = (node: PersonNode) => {
    const allNodes = [...this.props.nodes, ...this.props.families];

    var t0 = performance.now();
    const possibleConnections = allNodes
      .filter((n) => {
        if (n.isFamily) {
          return false;
        }
        return checkIfCanConnectAsChild(allNodes, node.id, n.id);
      })
      .map((n) => n.id);

    var t1 = performance.now();
    console.log(t1 - t0);
    console.log(possibleConnections);
    this.setState({
      connection: {
        firstTarget: this.state.connection.firstTarget,
        isConnecting: true,
        start: node,
        possibleConnections,
      },
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

    console.log("RENDER TREE RENDERER ");
    console.log(this.props.nodes);
    const loadedLinks = this.props.links
      .map((link: Link) => linkLoader(this.props.treeState, link))
      .filter((a: any) => a) as LinkLoaded[];
    return (
      <div>
        <TreeNodeDetailsDialog
          //TODO na podstawie nodea
          canEdit={true}
          open={nodeDialog.open}
          node={nodeDialog.node}
          onClose={this.handleDialogClose}
        />

        <Profiler
          id="xd"
          onRender={(
            id, // the "id" prop of the Profiler tree that has just committed
            phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
            actualDuration, // time spent rendering the committed update
            baseDuration, // estimated time to render the entire subtree without memoization
            startTime, // when React began rendering this update
            commitTime, // when React committed this update
            interactions // the Set of interactions belonging to this update
          ) => {
            // console.log("BASE " + baseDuration);
            // console.log("ACTUAL : " + actualDuration);
          }}
        >
          <NodesList
            // positionX={this.props.positionX}
            // positionY={this.props.positionY}
            // canvasWidth={this.props.canvasWidth}
            // canvasHeight={this.props.canvasHeight}
            possibleConnections={this.state.connection.possibleConnections}
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
          />
        </Profiler>

        <Families families={this.props.families} />

        <Links links={loadedLinks}>
          <FollowableLink
            enabled={this.state.connection.isConnecting}
            positionX={this.props.positionX}
            positionY={this.props.positionY}
            scale={this.props.scale}
            source={this.state.connection.start ?? { x: 1, y: 1 }}
          />
        </Links>
      </div>
    );
  };
}

const mapDispatch = {
  // getTree,
  // changeTreeName,
  // changeTreeVisibility,
  // addEmptyNode: addNode,
  // addParentAsync2,
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

const checkIfCanConnectAsChild = (
  nodes: Node[],
  childId: EntityId,
  parentId: EntityId
) => {
  var nodesCopy = JSON.parse(JSON.stringify(nodes)) as Node[];
  const parentNode = nodesCopy.find((n) => n.id == parentId) as PersonNode;
  const treeId = parentNode.treeId;
  const familyNode = new FamilyNode(
    randomFamilyId(),
    treeId,
    0,
    0,
    [childId],
    parentId,
    null
  );

  parentNode.families.push(familyNode.id);
  parentNode.children.push(childId);

  const childNode = nodesCopy.find((n) => n.id == childId) as PersonNode;
  childNode.families.push(familyNode.id);
  childNode.fatherId = parentId;

  nodesCopy.push(familyNode);
  var hasCycle = isGraphCyclic(nodesCopy);

  return !hasCycle;
};
const checkIfCanConnectToFamily = (
  nodes: Node[],
  childId: EntityId,
  familyId: EntityId
) => {
  var nodesCopy = JSON.parse(JSON.stringify(nodes)) as Node[];
  const familyNode = nodesCopy.find((n) => n.id == familyId) as FamilyNode;

  familyNode.children.push(childId);

  const parentsIds = [familyNode.fatherId, familyNode.motherId].filter(
    (a) => a
  ) as EntityId[];

  const parents = nodesCopy.filter((node) => parentsIds.includes(node.id));

  parents.forEach((parent) => {
    parent.children.push(childId);
  });

  const childNode = nodesCopy.find((node) => node.id == childId) as PersonNode;

  childNode.fatherId = familyNode.fatherId;
  childNode.motherId = familyNode.motherId;

  return !isGraphCyclic(nodesCopy);
};
