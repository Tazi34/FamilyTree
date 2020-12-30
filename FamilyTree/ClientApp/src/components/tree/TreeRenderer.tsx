import { EntityId, EntityState } from "@reduxjs/toolkit";
import { D3DragEvent } from "d3";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RECT_HEIGHT, RECT_WIDTH } from "../../d3/RectMapper";
import { ApplicationState } from "../../helpers";
import { Person } from "../../model/TreeStructureInterfaces";
import { isGraphCyclic } from "./graphAlgorithms/cycleDetection";
import {
  getLinkId,
  getLinkIdSelector,
  getNodeId,
  getNodeIdSelector,
} from "./helpers/idHelpers";
import { createPath } from "./helpers/linkCreationHelpers";
import {
  addDeleteIcon,
  addGearIcon,
  addPlusIcon,
  appendConnectionCircle,
  renderFamilyNode as renderFamilyNodes,
  renderNodeCards,
} from "./helpers/nodeCreationHelpers";
import {
  ConnectionPoint,
  connectionStartPointSelector,
  ConnectionState,
  finishConnection,
  isConnectingSelector,
  startConnecting,
} from "./connectionReducer";
import { FamilyNode } from "./model/FamilyNode";
import { Node } from "./model/NodeClass";
import { PersonNode } from "./model/PersonNode";
import {
  linkLoader,
  selectAllFamilies,
  selectAllNodesLocal,
  selectAllPersonNodes,
  TreeState,
} from "./reducer/treeReducer";
import {
  deleteNode,
  removeNodeFromTree,
  requestDeleteNode,
} from "./reducer/updateNodes/deleteNode";
import { moveNode } from "./reducer/updateNodes/moveNode";

import {
  connectToFamily,
  connectToFamilyAsync,
} from "./reducer/updateNodes/connectToFamily";
import { Link } from "./model/Link";
import {
  getIncomingLinks,
  getLinkNodes,
  getNodeById,
  getNodeLinks,
  getOutboundLinks,
  randomFamilyId,
} from "./reducer/utils/getOutboundLinks";
import { connectAsChildAsync } from "./reducer/updateNodes/connectAsChild";
import "./treeRenderer.css";
import { addParentAsync } from "./reducer/updateNodes/addParent";
import { CreateNodeRequestData } from "./API/createNode/createNodeRequest";
import { DeleteNodeRequestData } from "./API/deleteNode/deleteNodeRequest";
import PersonNodeCard from "./PersonNodeCard";
import LinkComponent, { LinkLoaded } from "./LinkComponent";
import FamilyNodeCard from "./FamilyNodeCard";
import { Dialog } from "@material-ui/core";
import TreeNodeDetailsDialog from "./TreeNodeDetailsDialog";
import { logger } from "../../helpers/logger";
const d3_base = require("d3");
const d3_dag = require("d3-dag");
const d3 = Object.assign({}, d3_base, d3_dag);

const nodesGroupId = "nodes_group";
const linksGroupId = "links_group";
//TODO PRZENIESC
export interface IDictionary<TValue> {
  [id: string]: TValue;
}

export interface TreeRendererProps {
  onAddNodeMenuClose: Function;
  rectWidth: number;
  onAddMenuOpen: Function;
  rectHeight: number;
  links: Link[];
  nodes: PersonNode[];
  families: FamilyNode[];
}

type NodeDialogProps = {
  open: boolean;
  node: PersonNode | null;
};

const TreeRenderer = (props: TreeRendererProps) => {
  const container = useRef<any>(null);
  const dispatch = useDispatch();

  const [connectingMode, setConnectingMode] = useState(false);
  const [startPoint, setStartPoint] = useState<ConnectionPoint | null>(null);
  const [canConnectTo, setCanConnectTo] = useState<IDictionary<boolean>>({});
  const [nodeDialog, setNodeDialog] = useState<NodeDialogProps>({
    open: false,
    node: null,
  });

  const treeState = useSelector<ApplicationState, TreeState>(
    (state) => state.tree
  );

  const allFamilyNodes = useSelector(selectAllFamilies);
  const isConnecting = useSelector(isConnectingSelector);
  const connectionStartPoint = useSelector(connectionStartPointSelector);
  const allNodes = useSelector(selectAllNodesLocal);
  const allPersonNodes = useSelector(selectAllPersonNodes);

  useEffect(() => {
    renderTree();
  });

  const renderTree = () => {
    const d3Container = selectContainer();
    d3Container.append("path").attr("id", "connectionPath");
    d3Container.attr("id", "main-group");

    d3Container.on("mousemove", (e: any) => {
      if (connectingMode) {
        var pathData = d3.path();
        pathData.moveTo(startPoint!.x, startPoint!.y);
        pathData.lineTo(e.layerX, e.layerY);

        var path = d3Container.select("#connectionPath");

        path.attr("d", pathData).attr("stroke", "black");
      }
    });
  };

  const changeVisibility = (familyNode: FamilyNode) => {
    if (!familyNode.isVisible) {
      traverseTree(familyNode, (node: any, i: any) => {
        var links = getNodeLinks(treeState, node);

        //Do refactoringu
        var nodesToShow = [node.id];
        if (node.isFamily) {
          nodesToShow = [...nodesToShow, node.firstParent, node.secondParent];
        }
        nodesToShow.forEach((n) => selectNode(n).attr("display", ""));

        if (i == 0) {
          //zapelnij kolko na galezi
          selectNode(node.id).select(".visibleCircle").attr("fill", "black");
        }
        links.forEach((link) => selectLink(link.id).attr("display", ""));
        familyNode.isVisible = true;
      });
    } else {
      //TODO visibility
      traverseTree(familyNode, (node: any, i: any) => {
        var links = getOutboundLinks(treeState, node);

        //zeby nie usuwac galazki piewrwszej
        if (i != 0 && i != 1) {
          links = [...links, ...getIncomingLinks(treeState, node)];
        }

        familyNode.isVisible = false;
        if (i == 0) {
          selectNode(node.id).select(".visibleCircle").attr("fill", "white");
        } else {
          var nodesToHide = [node.id];
          //TODO POPRAWIC
          if (node.isFamily) {
            nodesToHide = [...nodesToHide, node.firstParent, node.secondParent];
          }
          nodesToHide.forEach((n) => {
            selectNode(n).attr("display", "none");
          });
        }

        links.forEach((link) => selectLink(link.id).attr("display", "none"));
      });
    }
  };
  const initializeNodes = (
    nodesCanvas: any,
    nodes: PersonNode[],
    familyNodes: FamilyNode[]
  ) => {
    var allNodes = [...nodes, ...familyNodes];

    if (allNodes.length == 0) {
      return;
    }
    var allNodesSelector = nodesCanvas
      .selectAll()
      .data(allNodes)
      .enter()
      .append("div")
      .attr("class", "node")
      .attr("id", (d: any) => getNodeId(d.id));

    var peopleNodesSelector = allNodesSelector.filter((s: any) => !s.isFamily);
    var familyNodesSelector = allNodesSelector.filter((s: any) => s.isFamily);

    peopleNodesSelector.on("contextmenu", props.onAddMenuOpen);

    familyNodesSelector.attr(
      "transform",
      (d: any) => `translate(${d.x}px,${d.y}px)`
    );

    familyNodesSelector.on("click", (e: any, familyNode: FamilyNode) => {
      if (connectingMode) {
        if (canConnectTo[familyNode.id]) {
          setConnectingMode(false);
          setCanConnectTo({});
          dispatch(connectToFamilyAsync(startPoint!.id, familyNode.id));
        } else {
        }
      } else {
        changeVisibility(familyNode);
      }
    });
    renderFamilyNodes(familyNodesSelector);

    peopleNodesSelector.on("mouseover", (e: any, d: PersonNode) => {
      if (connectingMode) {
      }
    });

    //appendConnectionCircle(
    addGearIcon(
      peopleNodesSelector,
      (e: any, selectedNode: PersonNode) => {
        const point = {
          id: selectedNode.id,
          x: selectedNode.x,
          y: selectedNode.y,
        };

        if (!connectingMode) {
          setConnectingMode(true);
          setStartPoint(point);
          var canConnectToDict: IDictionary<boolean> = {};

          allPersonNodes
            .filter((node) => node.id != point.id)
            .forEach((node) => {
              canConnectToDict[node.id] = checkIfCanConnectAsChild(
                allNodes,
                point.id,
                node.id
              );
            });

          allFamilyNodes.forEach((family) => {
            canConnectToDict[family.id] = checkIfCanConnectToFamily(
              allNodes,
              point.id,
              family.id
            );
          });
          setCanConnectTo(canConnectToDict);
        } else {
          if (canConnectTo[point.id]) {
            dispatch(connectAsChildAsync(startPoint!.id, point.id));
            setConnectingMode(false);
            setStartPoint(null);
            d3.select("connectionPath").attr("d", "");
          } else {
            logger.log("Can connect to " + point.id);
          }
        }
      },
      (e: any, selectedNode: PersonNode) => {
        if (connectingMode) {
          logger.log(e);
          const d3Node = selectNode(selectedNode.id);
          if (!canConnectTo[selectedNode.id]) {
            d3Node.attr("opacity", "0.4");
          }
        }
      }
    );
    addDeleteIcon(peopleNodesSelector, (node: PersonNode) => {
      dispatch(requestDeleteNode(node.id as number));
    });
    //TODO ID
    const newFakePerson = Math.floor(Math.random() * 1000000 + 10000) + 100;
    const newPerson: CreateNodeRequestData = {
      treeId: props.nodes[0].treeId,
      name: "New",
      surname: "Node",
      birthday: "2020-12-16T20:29:42.677Z",
      description: "Cool description",
      pictureUrl: "",
      userId: 0,
      fatherId: 0,
      sex: "Male",
      motherId: 0,
      children: [],
      partners: [],
    };

    addPlusIcon(peopleNodesSelector, (node: PersonNode) => {
      dispatch(addParentAsync(node.id as number, newPerson));
    });
  };

  const selectContainer = () => {
    return d3.select(container.current);
  };
  const selectNodes = () => {
    return selectContainer().select(`#${nodesGroupId}`);
  };
  const selectLinks = () => {
    return selectContainer().select(`#${linksGroupId}`);
  };

  const selectNode = (id: any) => {
    return selectNodes().select(getNodeIdSelector(id));
  };

  const selectLink = (sourceId: any, targetId = null) => {
    return d3.selectAll(getLinkIdSelector(sourceId, targetId));
  };
  const handleNodeDelete = (id: number) => {
    //TODO api
    dispatch(removeNodeFromTree(id));
  };

  const loadedLinks = props.links
    .map((link) => linkLoader(treeState, link))
    .filter((a) => a) as LinkLoaded[];
  logger.log(loadedLinks);

  const handleParentAdd = (id: number, data: CreateNodeRequestData) => {
    dispatch(addParentAsync(id, data));
  };
  const handleNodeMove = (node: Node, x: number, y: number) => {
    dispatch(moveNode(node, x, y));
  };
  const moveNodeOnCanvas = (e: DragEvent, node: Node) => {
    if (connectingMode) {
      return;
    }

    var svgNode = d3.select("#n" + node.id);

    var x = e.x;
    var y = e.y;
    if (!node.isFamily) {
      x -= RECT_WIDTH / 2;
      y -= RECT_HEIGHT / 2;
    } else {
      x -= 5;
      y -= 5;
    }

    //move svg without moving node in redux store
    svgNode.style("transform", (d: any) => `translate(${x}px,${y}px)`);

    const outbondLinks = getOutboundLinks(treeState, node);

    outbondLinks.forEach((link: Link) => {
      const otherNodelocation = getNodeById(treeState, link.target);
      if (otherNodelocation) {
        var path = createPath(
          e.x,
          e.y,
          otherNodelocation.x,
          otherNodelocation.y
        );
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
  const traverseTree = (node: Node, callback: Function) => {
    traverseRec(node, callback, 0, (id: number) => getNodeById(treeState, id));
  };
  const handleNodeSelect = (personNode: PersonNode) => {
    setNodeDialog({ open: true, node: personNode });
  };
  const handleDialogClose = () => {
    setNodeDialog({ open: false, node: null });
  };

  return (
    <div ref={container} key={Math.random().toString()}>
      <TreeNodeDetailsDialog
        //TODO na podstawie nodea
        canEdit={true}
        open={nodeDialog.open}
        node={nodeDialog.node}
        onClose={handleDialogClose}
      />
      {props.nodes.map((node) => (
        <PersonNodeCard
          x={node.x}
          y={node.y}
          onNodeSelect={handleNodeSelect}
          onNodeMove={handleNodeMove}
          onParentAdd={handleParentAdd}
          person={node}
          onNodeDelete={handleNodeDelete}
          onMoveNodeOnCanvas={moveNodeOnCanvas}
        />
      ))}
      {props.families.map((family) => (
        <FamilyNodeCard
          family={family}
          onNodeMove={handleNodeMove}
          onMoveNodeOnCanvas={moveNodeOnCanvas}
        />
      ))}

      <svg
        style={{
          position: "absolute",
          width: 10,
          height: 10,
          top: 0,
          left: 0,
          zIndex: -100000,
          overflow: "visible",
        }}
      >
        {loadedLinks.map((loadedLink) => (
          <LinkComponent link={loadedLink} />
        ))}
      </svg>
    </div>
  );
};

export default React.memo(TreeRenderer);

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
