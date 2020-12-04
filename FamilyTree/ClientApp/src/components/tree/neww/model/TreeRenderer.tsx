import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RECT_HEIGHT, RECT_WIDTH } from "../../../../d3/RectMapper";
import {
  getLinkId,
  getLinkIdSelector,
  getNodeId,
  getNodeIdSelector,
} from "../../treeLogic/idHelpers";
import { createLinks, createPath } from "../../treeLogic/linkCreationHelpers";
import {
  addDeleteIcon,
  renderFamilyNode as renderFamilyNodes,
  renderNodeCards,
} from "../../treeLogic/nodeCreationHelpers";
import {
  deleteNode,
  FamilyNode,
  Link,
  TreeNode,
  selectAllFamilies,
  selectAllLinks,
  selectAllNodes,
  selectAllPeopleInCurrentTree,
} from "./treeReducer";
import { ApplicationState } from "../../../../helpers";
const d3_base = require("d3");
const d3_dag = require("d3-dag");
const d3 = Object.assign({}, d3_base, d3_dag);

const nodesGroupId = "nodes_group";
const linksGroupId = "links_group";

export interface TreeRendererProps {
  onAddNodeMenuClose: Function;
  rectWidth: number;
  onAddMenuOpen: Function;
  rectHeight: number;
  links: Link[];
  nodes: Node[];
  families: FamilyNode[];
}

const TreeRenderer = (props: TreeRendererProps) => {
  const container = useRef(null);
  const dispatch = useDispatch();
  const state = useSelector((state: ApplicationState) => state.tree);

  const effect = useEffect(() => {
    initializeTree();
  }, [props.nodes, props.links, props.families]);

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
    nodes: TreeNode[],
    familyNodes: FamilyNode[],
    links: Link[]
  ) => {
    appendStartGroups();

    var containerGroup = d3.select(container.current);
    var linksCanvas = containerGroup.select(`#${linksGroupId}`);
    var nodesCanvas = containerGroup.select(`#${nodesGroupId}`);
    links.forEach((l: Link) => console.log(l.relation));
    initializeNodes(nodesCanvas, nodes, familyNodes);
    initializeLinks(linksCanvas, links);
  };

  const changeVisibility = (familyNode: any) => {
    if (familyNode.isHidden) {
      familyNode.each((node: any, i: any) => {
        var links = [...node.targetLinks, ...node.sourceLinks];

        //Do refactoringu
        var nodesToShow = [node.id];
        if (node.isFamily) {
          nodesToShow = [
            ...nodesToShow,
            node.family.firstParent,
            node.family.secondParent,
          ];
        }
        nodesToShow.forEach((n) => selectNode(n).attr("display", ""));

        if (i == 0) {
          //zapelnij kolko na galezi
          selectNode(node.id).select(".visibleCircle").attr("fill", "black");
        }
        links.forEach((link) => selectLink(link.id).attr("display", ""));
        familyNode.isHidden = false;
      });
    } else {
      familyNode.each((node: any, i: any) => {
        var links = [...node.sourceLinks];

        //zeby nie usuwac galazki piewrwszej
        if (i != 0 && i != 1) {
          links = [...links, ...node.targetLinks];
        }

        familyNode.isHidden = true;
        if (i == 0) {
          selectNode(node.id).select(".visibleCircle").attr("fill", "white");
        } else {
          var nodesToHide = [node.id];
          if (node.isFamily) {
            nodesToHide = [
              ...nodesToHide,
              node.family.firstParent,
              node.family.secondParent,
            ];
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
    nodes: TreeNode[],
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

    var dragHandler = d3.drag().on("drag", (e: any, d: any) => {
      moveNode(e, d);

      //close context menu if open
      props.onAddNodeMenuClose(e);
    });
    dragHandler(allNodesSelector);
    dragHandler(familyNodesSelector);
    peopleNodesSelector.on("contextmenu", props.onAddMenuOpen);

    peopleNodesSelector.attr(
      "transform",
      (d: any) => `translate(${d.x - RECT_WIDTH / 2},${d.y - RECT_HEIGHT / 2})`
    );

    familyNodesSelector.attr(
      "transform",
      (d: any) => `translate(${d.x},${d.y})`
    );

    familyNodesSelector.on("click", (e: any, d: any) => changeVisibility(d));
    renderFamilyNodes(familyNodesSelector);
    renderNodeCards(peopleNodesSelector);

    addDeleteIcon(peopleNodesSelector, (node: TreeNode) => {
      dispatch(deleteNode(node));
    });
  };

  const initializeLinks = (linksCanvas: any, data: Link[]) => {
    var linksSelector = linksCanvas.selectAll("line.link").data(data).enter();
    createLinks(linksSelector);
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

  const moveNode = (e: any, node: any) => {
    node.x += e.dx;
    node.y += e.dy;

    var svgNode = selectNode(node.id);

    var x = node.x;
    var y = node.y;
    if (!node.isFamily) {
      x = x - RECT_WIDTH / 2;
      y = y - RECT_HEIGHT / 2;
    }

    svgNode.attr("transform", (d: any) => `translate(${x},${y})`);
    var allLinks = [...node.sourceLinks, ...node.targetLinks];
    allLinks.forEach((link) => {
      var path = createPath(link);
      var svgLink = selectLink(link.id);
      svgLink.select("path").attr("d", path);
    });
    console.log(e);
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
