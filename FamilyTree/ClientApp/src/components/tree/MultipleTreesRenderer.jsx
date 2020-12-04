import * as React from "react";
import { RECT_HEIGHT, RECT_WIDTH } from "../../d3/RectMapper";
import {
  getLinkId,
  getLinkIdSelector,
  getNodeId,
  getNodeIdSelector,
} from "./treeLogic/idHelpers";
import { createLinks, createLinkPath } from "./treeLogic/linkCreationHelpers";
import {
  addDeleteIcon,
  renderFamilyNode as renderFamilyNodes,
  renderNodeCards,
} from "./treeLogic/nodeCreationHelpers";

const d3_base = require("d3");
const d3_dag = require("d3-dag");
const d3 = Object.assign({}, d3_base, d3_dag);

const nodesGroupId = "nodes_group";
const linksGroupId = "links_group";

class MultipleTreesRenderer extends React.Component {
  constructor(props) {
    super(props);
    this.container = React.createRef();
    this.allNodes = [];
    this.allLinks = [];
    this.state = {
      isInConnectingMode: false,
    };
  }

  initializeTree = () => {
    const {
      rectWidth,
      rectHeight,
      treeStructure: treeStructure,
      trees,
    } = this.props;
    var roots = [];
    console.log(trees);
    var links = [];
    var people = [];
    var families = [];
    trees.forEach((tree) => {
      var linksData = tree.links;
      var d3tree = d3
        .sugiyama()
        .nodeSize([100, 100])
        .layering(d3.layeringSimplex())
        .decross(d3.decrossOpt)
        .coord(d3.coordVert())
        .separation((a, b) => {
          return 1;
        });

      const dag = d3.dagConnect()(linksData);
      d3tree(dag);
      var nodes = dag.descendants();

      roots.push(nodes.find((a) => a.layer == 0));
      links = [...links, ...tree.links];
      people = {
        ...people,
        ...tree.people,
      };
      families = [...families, ...tree.families];
    });
    console.log(roots);

    roots.forEach((root) => {
      links.push(["connecting_node", root.id]);
    });
    var structure = {
      people,
      families,
      links,
    };
    var linksData = structure.links;

    const container = this.selectContainer();
    container.attr("transform", "translate(-500,0)");
    var x_sep = rectWidth + 50,
      y_sep = rectHeight + 100;

    var tree = d3
      .sugiyama()
      .nodeSize([x_sep, y_sep])
      .layering(d3.layeringSimplex())
      .decross(d3.decrossOpt)
      .coord(d3.coordVert())
      .separation((a, b) => {
        return 1;
      });

    const dag = d3.dagConnect()(linksData);
    tree(dag);
    var d3Nodes = dag.descendants();
    var d3Links = dag.links();

    d3Nodes.forEach((n) => {
      var data = structure.people[n.id];
      n.incomingLinks = [];
      n.outboundLinks = [];
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

    d3Links.forEach((l) => {
      l.id = getLinkId(l.source.id, l.target.id);
      l.source.outboundLinks.push(l);
      l.target.incomingLinks.push(l);
    });

    this.updateNodesAndLinks(d3Nodes, d3Links);
  };

  appendStartGroups = () => {
    const containerGroup = this.selectContainer();
    containerGroup.select(`#${linksGroupId}`).remove();
    containerGroup.select(`#${nodesGroupId}`).remove();
    containerGroup.append("g").attr("id", linksGroupId);
    containerGroup.append("g").attr("id", nodesGroupId);
  };

  updateNodesAndLinks(nodes, links) {
    this.appendStartGroups();
    this.allNodes = nodes;
    this.allLinks = links;
    var containerGroup = d3.select(this.container.current);
    var linksCanvas = containerGroup.select(`#${linksGroupId}`);
    var nodesCanvas = containerGroup.select(`#${nodesGroupId}`);

    this.initializeNodes(nodesCanvas, nodes);
    this.initializeLinks(linksCanvas, links);
  }

  //Leave everything after inital render to d3
  shouldComponentUpdate = () => {
    return false;
  };
  changeVisibility = (familyNode) => {
    if (familyNode.isHidden) {
      familyNode.each((node, i) => {
        var links = [...node.incomingLinks, ...node.outboundLinks];

        //Do refactoringu
        var nodesToShow = [node.id];
        if (node.isFamily) {
          nodesToShow = [
            ...nodesToShow,
            node.family.firstParent,
            node.family.secondParent,
          ];
        }
        nodesToShow.forEach((n) => this.selectNode(n).attr("display", ""));

        if (i == 0) {
          //zapelnij kolko na galezi
          this.selectNode(node.id)
            .select(".visibleCircle")
            .attr("fill", "black");
        }
        links.forEach((link) => this.selectLink(link.id).attr("display", ""));
        familyNode.isHidden = false;
      });
    } else {
      familyNode.each((node, i) => {
        var links = [...node.outboundLinks];

        //zeby nie usuwac galazki piewrwszej
        if (i != 0 && i != 1) {
          links = [...links, ...node.incomingLinks];
        }

        familyNode.isHidden = true;
        if (i == 0) {
          this.selectNode(node.id)
            .select(".visibleCircle")
            .attr("fill", "white");
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
            this.selectNode(n).attr("display", "none");
          });
        }

        links.forEach((link) =>
          this.selectLink(link.id).attr("display", "none")
        );
      });
    }
  };
  initializeNodes = (nodes, data) => {
    var nodesSvg = nodes
      .selectAll()
      .data(data)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("id", (d) => getNodeId(d.id));

    var nonEmptyNodes = nodesSvg.filter((d) => !d.isFamily && !d.isFake);
    var familyNodes = nodesSvg.filter((d) => d.isFamily);

    var dragHandler = d3.drag().on("drag", (e, d) => {
      this.moveNode(e, d);

      //close menu if open
      this.props.onAddNodeMenuClose(e);
    });
    dragHandler(nonEmptyNodes);
    nonEmptyNodes.on("contextmenu", this.props.onAddNodeMenuOpen);

    nonEmptyNodes.attr(
      "transform",
      (d) => `translate(${d.x - RECT_WIDTH / 2},${d.y - RECT_HEIGHT / 2})`
    );

    dragHandler(familyNodes);
    familyNodes.attr("transform", (d) => `translate(${d.x},${d.y})`);

    familyNodes.on("click", (e, d) => this.changeVisibility(d));
    renderFamilyNodes(familyNodes);
    renderNodeCards(nonEmptyNodes);
    const nodesThatCanBeDeleted = nonEmptyNodes.filter(
      (d) => d.data.canBeDeleted
    );
    addDeleteIcon(nodesThatCanBeDeleted, this.deleteNode);
  };
  addChild = (parent) => {};

  initializeLinks = (links, data) => {
    var linksSelector = links.selectAll("line.link").data(data).enter();
    createLinks(linksSelector);
  };
  selectContainer = () => {
    return d3.select(this.container.current);
  };
  selectNodes = () => {
    return this.selectContainer().select(`#${nodesGroupId}`);
  };
  selectLinks = () => {
    return this.selectContainer().select(`#${linksGroupId}`);
  };

  selectNode = (id) => {
    return this.selectNodes().select(getNodeIdSelector(id));
  };

  selectLink = (sourceId, targetId = null) => {
    return this.selectLinks().select(getLinkIdSelector(sourceId, targetId));
  };

  deleteNode = (node) => {
    const { id } = node;

    console.log(node);
    this.selectNode(id).remove();
    var links = [...node.outboundLinks, ...node.incomingLinks];
    links.forEach((link) => {
      this.selectLink(link.id).remove();
      console.log(link);
      var targetedFamily =
        node.id == link.source.id ? link.target : link.source;

      if (targetedFamily.id != "connecting_node") {
        removeNodeFromFamily(targetedFamily.family, node.id);
        this.deleteFamilyConnectionsIfNeeded(targetedFamily.family, node.id);
      }
    });
  };
  deleteFamilyConnectionsIfNeeded = (family, removedNode) => {
    if (
      (!family.firstParent && !family.secondParent) ||
      family.children.length == 0
    ) {
      var linksToDelete = [
        getLinkId(removedNode, family.id),
        getLinkId(family.firstParent, family.id),
        getLinkId(family.secondParent, family.id),
        ...family.children.map((c) => getLinkId(family.id, c)),
      ];

      this.selectNode(family.id).remove();
      this.selectLinks()
        .selectAll("g")
        .filter((a) => linksToDelete.includes(a.id))
        .remove();
    }
  };
  moveNode = (e, node) => {
    node.x += e.dx;
    node.y += e.dy;

    var svgNode = this.selectNode(node.id);

    var x = node.x;
    var y = node.y;
    if (!node.isFamily) {
      x = x - RECT_WIDTH / 2;
      y = y - RECT_HEIGHT / 2;
    }

    svgNode.attr("transform", (d) => `translate(${x},${y})`);
    var allLinks = [...node.outboundLinks, ...node.incomingLinks];
    allLinks.forEach((link) => {
      var path = createLinkPath(link);
      var svgLink = this.selectLink(link.id);
      svgLink.select("path").attr("d", path);
    });
  };
  componentDidMount = () => {
    this.initializeTree();
  };
  componentDidUpdate = () => {};
  render() {
    return <g ref={this.container} key={Math.random().toString()}></g>;
  }
}

export default MultipleTreesRenderer;

export const removeNodeFromFamily = (family, id) => {
  if (family.firstParent == id) {
    family.firstParent = null;
  } else if (family.secondParent == id) {
    family.secondParent = null;
  } else {
    family.children = family.children.filter((a) => a != id);
  }
};
