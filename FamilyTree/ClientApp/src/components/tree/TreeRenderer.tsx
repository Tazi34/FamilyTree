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
  selectAllFamilies,
  selectAllNodesLocal,
  selectAllPersonNodes,
  TreeState,
} from "./reducer/treeReducer";
import {
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
// const getNode = (id: number | string): FamilyNode | PersonNode | undefined => {
//   return useSelector((state: ApplicationState) => getNodeById(state, id));
// };

const TreeRenderer = (props: TreeRendererProps) => {
  const container = useRef<any>(null);
  const dispatch = useDispatch();

  const [connectingMode, setConnectingMode] = useState(false);
  const [startPoint, setStartPoint] = useState<ConnectionPoint | null>(null);
  const [canConnectTo, setCanConnectTo] = useState<IDictionary<boolean>>({});

  const treeState = useSelector<ApplicationState, TreeState>(
    (state) => state.tree
  );
  const allFamilyNodes = useSelector(selectAllFamilies);
  const isConnecting = useSelector(isConnectingSelector);
  const connectionStartPoint = useSelector(connectionStartPointSelector);
  const allNodes = useSelector(selectAllNodesLocal);
  const allPersonNodes = useSelector(selectAllPersonNodes);
  useEffect(() => {
    console.log("Repaint tree");
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

    updateNodesAndLinks(props.nodes, props.families, props.links);
  };

  const appendStartGroups = () => {
    const containerGroup = selectContainer();
    containerGroup.select(`#${linksGroupId}`).remove();
    containerGroup.select(`#${nodesGroupId}`).remove();
    containerGroup.append("g").attr("id", linksGroupId);
    containerGroup.append("g").attr("id", nodesGroupId);
  };

  const updateNodesAndLinks = (
    nodes: PersonNode[],
    familyNodes: FamilyNode[],
    links: Link[]
  ) => {
    appendStartGroups();

    var containerGroup = d3.select(container.current);
    var linksCanvas = containerGroup.select(`#${linksGroupId}`);
    var nodesCanvas = containerGroup.select(`#${nodesGroupId}`);

    initializeNodes(nodesCanvas, nodes, familyNodes);
    initializeLinks(linksCanvas, links);
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
      .append("g")
      .attr("class", "node")
      .attr("id", (d: any) => getNodeId(d.id));

    var peopleNodesSelector = allNodesSelector.filter((s: any) => !s.isFamily);
    var familyNodesSelector = allNodesSelector.filter((s: any) => s.isFamily);

    peopleNodesSelector.on("contextmenu", props.onAddMenuOpen);

    peopleNodesSelector.attr(
      "transform",
      (d: any) =>
        `translate(${d.location.x - RECT_WIDTH / 2},${
          d.location.y - RECT_HEIGHT / 2
        })`
    );

    familyNodesSelector.attr(
      "transform",
      (d: any) => `translate(${d.location.x},${d.location.y})`
    );

    familyNodesSelector.on("click", (e: any, familyNode: FamilyNode) => {
      if (connectingMode) {
        if (canConnectTo[familyNode.id]) {
          setConnectingMode(false);
          setCanConnectTo({});
          dispatch(connectToFamilyAsync(startPoint!.id, familyNode.id));
        } else {
          console.log("Cant connect to " + familyNode.id);
        }
      } else {
        changeVisibility(familyNode);
      }
    });
    renderFamilyNodes(familyNodesSelector);
    renderNodeCards(peopleNodesSelector);

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
          x: selectedNode.location.x,
          y: selectedNode.location.y,
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
          console.log(canConnectToDict);
        } else {
          if (canConnectTo[point.id]) {
            dispatch(connectAsChildAsync(startPoint!.id, point.id));
            setConnectingMode(false);
            setStartPoint(null);
            d3.select("connectionPath").attr("d", "");
          } else {
            console.log("Can connect to " + point.id);
          }
        }
      },
      (e: any, selectedNode: PersonNode) => {
        if (connectingMode) {
          console.log(e);
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
      birthday: "2020-12-17T07:15:08.998Z",
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

    //addGearIcon(peopleNodesSelector);

    var dragHandler = d3
      .drag()
      .subject((e: any, node: Node) => node.location)
      .on("drag", (e: any, d: any) => {
        moveNodeOnCanvas(e, d);
        //close context menu if open

        props.onAddNodeMenuClose(e);
      })
      .on("end", (e: D3DragEvent<any, any, Node>, node: Node) => {
        dispatch(moveNode(node, e.x, e.y));
      });

    dragHandler(allNodesSelector);
    dragHandler(familyNodesSelector);
  };

  const initializeLinks = (linksCanvas: any, data: Link[]) => {
    var linksSelector = linksCanvas.selectAll("line.link").data(data).enter();
    createLinks(linksCanvas, linksSelector);
  };
  const createLinks = (linksCanvas: any, linksSelector: any) => {
    linksSelector.each(function (link: Link) {
      const { sourceNode, targetNode } = getLinkNodes(treeState, link);

      if (!sourceNode || !targetNode) {
        return;
      }
      if (!sourceNode.isVisible || !targetNode.isVisible) {
        return;
      }

      var pathData = createPath(
        sourceNode.location.x,
        sourceNode.location.y,
        targetNode.location.x,
        targetNode.location.y
      );

      linksCanvas
        .append("g")
        .attr("class", "link")
        .attr("id", (link: Link) => {
          return getLinkId(sourceNode.id, targetNode.id);
        })
        .append("path")
        .attr("d", pathData)
        .attr("fill", "none")
        .attr("stroke", (d: Link) => {
          //TODO

          return "black";
        })
        .attr("stroke-width", 1);
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
    return selectLinks().select(getLinkIdSelector(sourceId, targetId));
  };

  const moveNodeOnCanvas = (e: DragEvent, node: Node) => {
    if (connectingMode) {
      return;
    }

    var svgNode = selectNode(node.id);

    var x = e.x;
    var y = e.y;
    if (!node.isFamily) {
      x -= RECT_WIDTH / 2;
      y -= RECT_HEIGHT / 2;
    }

    //move svg without moving node in redux store
    svgNode.attr("transform", (d: any) => `translate(${x},${y})`);

    const outbondLinks = getOutboundLinks(treeState, node);

    outbondLinks.forEach((link: Link) => {
      const otherNodelocation = getNodeById(treeState, link.target);
      if (otherNodelocation) {
        var path = createPath(
          e.x,
          e.y,
          otherNodelocation.location.x,
          otherNodelocation.location.y
        );
        var svgLink = selectLink(link.id);
        svgLink.select("path").attr("d", path);
      }
    });
    const incomingLinks = getIncomingLinks(treeState, node);

    incomingLinks.forEach((link: Link) => {
      const otherNodelocation = getNodeById(treeState, link.source);
      if (otherNodelocation) {
        var path = createPath(
          otherNodelocation.location.x,
          otherNodelocation.location.y,
          e.x,
          e.y
        );
        var svgLink = selectLink(link.id);
        svgLink.select("path").attr("d", path);
      }
    });
  };
  const traverseTree = (node: Node, callback: Function) => {
    traverseRec(node, callback, 0, (id: number) => getNodeById(treeState, id));
  };
  return <g ref={container} key={Math.random().toString()}></g>;
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
