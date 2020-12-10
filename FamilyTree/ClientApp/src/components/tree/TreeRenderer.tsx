import { EntityId } from "@reduxjs/toolkit";
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
  ConnectionState,
  finishConnection,
  startConnecting,
} from "./connectionReducer";
import { FamilyNode } from "./model/FamilyNode";
import { Node } from "./model/NodeClass";
import { PersonNode } from "./model/PersonNode";
import {
  addParent,
  connectParent,
  deleteNode,
  getIncomingLinks,
  getLinkNodes,
  getNodeById,
  getNodeLinks,
  getOutboundLinks,
  Link,
  moveNode,
  selectAllFamiliesLocal,
  selectAllNodes,
  selectAllNodesLocal,
  TreeState,
} from "./treeReducer";

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
  const container = useRef(null);
  const dispatch = useDispatch();
  const connectionState = useSelector<ApplicationState, ConnectionState>(
    (state) => state.connection
  );
  const [connectingMode, setConnectingMode] = useState(false);
  const treeState = useSelector<ApplicationState, TreeState>(
    (state) => state.tree
  );
  const effect = useEffect(() => {
    initializeTree();
  }, [props.nodes, props.links, props.families, connectionState]);

  const initializeTree = () => {
    const container = selectContainer();
    container.attr("transform", "translate(-500,0)");
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
    console.log("RERENDER");
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

    familyNodesSelector.on("click", (e: any, d: any) => changeVisibility(d));
    renderFamilyNodes(familyNodesSelector);
    renderNodeCards(peopleNodesSelector);

    // appendConnectionCircle(peopleNodesSelector, (e: any, node: PersonNode) => {
    //   if (!connectionState.isConnecting) {
    //     dispatch(startConnecting(node.id));
    //   } else {
    //     dispatch(finishConnection(node.id));
    //     dispatch(connectParent(connectionState.start as EntityId, node.id));
    //   }
    // });
    addDeleteIcon(peopleNodesSelector, (node: PersonNode) => {
      dispatch(deleteNode(node));
    });
    const usedIds = nodes.map((n) => n.id);
    //TODO ID
    const newFakePerson = Math.floor(Math.random() * 1000000 + 10000) + 100;
    const newPerson: Person = {
      id: newFakePerson,
      information: {
        name: "New",
        surname: "Node",
        birthDate: "20-05-1454",
      },
      fatherId: null,
      motherId: null,
      children: [],
      partners: [],
    };

    addPlusIcon(peopleNodesSelector, (node: PersonNode) => {
      dispatch(addParent(node.id as number, newPerson));
    });

    addGearIcon(peopleNodesSelector, () => {
      const peopleNodes = selectAllNodesLocal(treeState.nodes);
      const familyNodes = selectAllFamiliesLocal(treeState.families);
      alert(isGraphCyclic([...peopleNodes, ...familyNodes]));
    });
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
