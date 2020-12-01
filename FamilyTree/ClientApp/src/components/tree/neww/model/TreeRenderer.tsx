import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { TreeNode } from "../../../../model/TreeInterfaces";
import {
  Family,
  Person,
  TreeStructure,
} from "../../../../model/TreeStructureInterfaces";
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
import { Link } from "./treeReducer";
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
  trees: TreeStructure[];
}

const TreeRenderer = (props: TreeRendererProps) => {
  const container = useRef(null);
  const dispatch = useDispatch();

  const initializeTree = () => {
    const { rectWidth, rectHeight, trees } = props;

    var roots: any = [];
    console.log(trees);
    var links: Link[] = [];
    var people: Person[] = [];
    var families: Family[] = [];
    trees.forEach((tree) => {
      var linksData = tree.links;
      var d3tree = d3
        .sugiyama()
        .nodeSize([100, 100])
        .layering(d3.layeringSimplex())
        .decross(d3.decrossOpt)
        .coord(d3.coordVert())
        .separation((a: any, b: any) => {
          return 1;
        });

      const dag = d3.dagConnect()(linksData);
      d3tree(dag);
      var nodes = dag.descendants();

      roots.push(nodes.find((a: any) => a.layer == 0));
      links = [...links, ...tree.links];
      people = {
        ...people,
        ...tree.people,
      };
      families = [...families, ...tree.families];
    });
    console.log(roots);

    roots.forEach((root: any) => {
      links.push(["connecting_node", root.id]);
    });
    var structure = {
      people,
      families,
      links,
    };
    var linksData = structure.links;

    const container = selectContainer();
    container.attr("transform", "translate(-500,0)");
    var x_sep = rectWidth + 50,
      y_sep = rectHeight + 100;

    var tree = d3
      .sugiyama()
      .nodeSize([x_sep, y_sep])
      .layering(d3.layeringSimplex())
      .decross(d3.decrossOpt)
      .coord(d3.coordVert())
      .separation((a: any, b: any) => {
        return 1;
      });

    const dag = d3.dagConnect()(linksData);
    tree(dag);
    var d3Nodes = dag.descendants();
    var d3Links = dag.links();

    d3Nodes.forEach((n: any) => {
      var data = structure.people[n.id];
      n.targetLinks = [];
      n.sourceLinks = [];
      if (data) {
        n.data = data;

        n.isFamily = false;
      } else {
        var family = structure.families.find((a) => a.id == n.id);
        if (family) {
          n.isFamily = true;
          n.family = family;
        } else {
          n.isFamily = false;
          n.isFake = true;
        }
      }
    });

    d3Links.forEach((l: any) => {
      l.id = getLinkId(l.source.id, l.target.id);
      l.source.sourceLinks.push(l);
      l.target.targetLinks.push(l);
    });

    updateNodesAndLinks(d3Nodes, d3Links);
  };

  const appendStartGroups = () => {
    const containerGroup = selectContainer();
    containerGroup.select(`#${linksGroupId}`).remove();
    containerGroup.select(`#${nodesGroupId}`).remove();
    containerGroup.append("g").attr("id", linksGroupId);
    containerGroup.append("g").attr("id", nodesGroupId);
  };

  const updateNodesAndLinks = (nodes: any, links: any) => {
    appendStartGroups();
    const allNodes = nodes;
    const allLinks = links;
    var containerGroup = d3.select(container.current);
    var linksCanvas = containerGroup.select(`#${linksGroupId}`);
    var nodesCanvas = containerGroup.select(`#${nodesGroupId}`);

    initializeNodes(nodesCanvas, nodes);
    initializeLinks(linksCanvas, links);
  };

  //Leave everything after inital render to d3
  const shouldComponentUpdate = () => {
    return false;
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
  const initializeNodes = (nodes: any, data: any) => {
    var nodesSvg = nodes
      .selectAll()
      .data(data)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("id", (d: any) => getNodeId(d.id));

    var nonEmptyNodes = nodesSvg.filter((d: any) => !d.isFamily && !d.isFake);
    var familyNodes = nodesSvg.filter((d: any) => d.isFamily);

    var dragHandler = d3.drag().on("drag", (e: any, d: any) => {
      moveNode(e, d);

      //close menu if open
      props.onAddNodeMenuClose(e);
    });
    dragHandler(nonEmptyNodes);
    nonEmptyNodes.on("contextmenu", props.onAddMenuOpen);

    nonEmptyNodes.attr(
      "transform",
      (d: any) => `translate(${d.x - RECT_WIDTH / 2},${d.y - RECT_HEIGHT / 2})`
    );

    dragHandler(familyNodes);
    familyNodes.attr("transform", (d: any) => `translate(${d.x},${d.y})`);

    familyNodes.on("click", (e: any, d: any) => changeVisibility(d));
    renderFamilyNodes(familyNodes);
    renderNodeCards(nonEmptyNodes);
    const nodesThatCanBeDeleted = nonEmptyNodes.filter(
      (d: any) => d.data.canBeDeleted
    );
    addDeleteIcon(nodesThatCanBeDeleted, deleteNode);
  };

  const initializeLinks = (links: any, data: any) => {
    var linksSelector = links.selectAll("line.link").data(data).enter();
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

  const deleteNode = (node: any) => {
    const { id } = node;

    console.log(node);
    selectNode(id).remove();
    var links = [...node.sourceLinks, ...node.targetLinks];
    links.forEach((link) => {
      selectLink(link.id).remove();
      console.log(link);
      var targetedFamily =
        node.id == link.source.id ? link.target : link.source;

      if (targetedFamily.id != "connecting_node") {
        removeNodeFromFamily(targetedFamily.family, node.id);
        deleteFamilyConnectionsIfNeeded(targetedFamily.family, node.id);
      }
    });
  };
  const deleteFamilyConnectionsIfNeeded = (family: any, removedNode: any) => {
    if (
      (!family.firstParent && !family.secondParent) ||
      family.children.length == 0
    ) {
      var linksToDelete = [
        getLinkId(removedNode, family.id),
        getLinkId(family.firstParent, family.id),
        getLinkId(family.secondParent, family.id),
        ...family.children.map((c: any) => getLinkId(family.id, c)),
      ];

      selectNode(family.id).remove();
      selectLinks()
        .selectAll("g")
        .filter((a: any) => linksToDelete.includes(a.id))
        .remove();
    }
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
  };

  return <g ref={container} key={Math.random().toString()}></g>;
};

export default TreeRenderer;

export const removeNodeFromFamily = (family: any, id: any) => {
  if (family.firstParent == id) {
    family.firstParent = null;
  } else if (family.secondParent == id) {
    family.secondParent = null;
  } else {
    family.children = family.children.filter((a: any) => a != id);
  }
};
