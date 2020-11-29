import * as React from "react";
import { TreeStructure } from "../../model/TreeStructureInterfaces";
import {
  deleteIcon,
  gearIcon,
  plusIcon,
  RECT_HEIGHT,
  RECT_WIDTH,
} from "../../d3/RectMapper";
import {
  getLinkId,
  getNodeId,
  getLinkIdSelector,
  getNodeIdSelector,
} from "./treeLogic/idHelpers";
import data from "../../samples/multipleDisconnectedGraphs.js";
import {
  emptyNodeAttributs,
  rectangleAttributes,
} from "../../d3/NodeAttributes";
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
      var root = d3tree(dag);
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
      links.push(["fakerinio", root.id]);
    });
    var structure = {
      people,
      families,
      links,
    };
    var linksData = structure.links;

    console.log(structure);
    const conatiner = this.selectContainer();
    conatiner.attr("transform", "translate(-500,0)");
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
    var root = tree(dag);
    var nodes = dag.descendants();

    nodes.forEach((n) => {
      var data = structure.people[n.id];
      if (data) {
        n.data = data;
        n.isFamily = false;
      } else {
        if (structure.families.some((a) => a.id == n.id)) {
          n.isFamily = true;
        } else {
          n.isFamily = false;
          n.isFake = true;
        }
      }
    });

    this.updateNodesAndLinks(root.descendants(), root.links());
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

  initializeNodes = (nodes, data) => {
    var g = nodes
      .selectAll()
      .data(data)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("id", (d) => getNodeId(d.id))
      .filter((d) => !d.isFamily && !d.isFake);
    var dragHandler = d3.drag().on("drag", (e, d) => {
      this.moveNode(e, d);
    });
    dragHandler(g);
    g.attr(
      "transform",
      (d) => `translate(${d.x - RECT_WIDTH / 2},${d.y - RECT_HEIGHT / 2})`
    ).on("drag", this.moveNode);

    g.append("image")
      .attr(
        "href",
        "https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png"
      )
      .attr("height", 30)
      .attr("width", 30);
    g.append("rect").each(function (d) {
      var u = d3.select(this);
      const attributes = d.isFamily ? emptyNodeAttributs : rectangleAttributes;
      for (const key in attributes) {
        u = u.attr(key, attributes[key]);
      }
    });
    g.append("path").attr("d", gearIcon);
    g.append("path").attr("d", plusIcon);
    g.append("text")
      .attr("x", 10)
      .attr("y", 100)
      .text((d) => (d.isFamily ? "" : `${d.data.id}____23 May, 1956`));
    g.append("text")
      .attr("x", 72)
      .attr("y", 25)
      .text((d) => {
        var text = "";
        if (d.data.information) {
          const { name, surname } = d.data.information;
          text = `${name} ${surname}`;
        }
        return text;
      });

    const nodesThatCanBeDeleted = g.filter((d) => d.data.canBeDeleted);

    nodesThatCanBeDeleted
      .append("g")
      .attr("transform", `translate(${192}, ${60})scale(1.5)`)
      .append("path")
      .attr("d", deleteIcon)
      .on("click", (event, d) => {
        this.deleteNode(d);
      });
    nodes.selectAll("circle.node").data(data).enter();

    return nodes;
  };
  initializeLinks = (links, data) => {
    var lineGenerator = d3.line();

    links
      .selectAll("line.link")
      .data(data)
      .enter()
      .each(function (d) {
        var link = d;
        if (link.source.isFake || link.target.isFake) {
          return;
        }
        var points = [
          [parseInt(link.source.x), parseInt(link.source.y)],
          [parseInt(link.target.x), parseInt(link.target.y)],
        ];

        var pathData = lineGenerator(points);

        d3.select(this)
          .append("g")
          .attr("class", "link")
          .attr("id", (link) => {
            return getLinkId(link.source.id, link.target.id);
          })
          .append("path")
          .attr("d", pathData)
          .attr("stroke", (d) => {
            var graphIndex = 3;

            var graphIndex = link.source.data.graph
              ? link.source.data.graph
              : link.target.data.graph;

            return colorArray[graphIndex - 1];
          })
          .attr("stroke-width", 1);
      });
    return links;
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
  moveNode = (e, node) => {
    node.x += e.dx;
    node.y += e.dy;

    this.selectNode(node.id).attr(
      "transform",
      (d) => `translate(${node.x - RECT_WIDTH / 2},${node.y - RECT_HEIGHT / 2})`
    );
  };

  deleteNode = (node) => {
    const { id } = node;
    console.log(node);
    this.updateNodesAndLinks(
      this.allNodes.filter((n) => n != node),
      this.allLinks
    );
    //this.selectNodes().select(getNodeIdSelector(id)).remove();
  };

  componentDidMount = () => {
    this.initializeTree();
  };
  componentDidUpdate = () => {
    this.initializeTree();
  };
  render() {
    return <g ref={this.container} key={Math.random().toString()}></g>;
  }
}

export default MultipleTreesRenderer;
var colorArray = ["black", "red", "blue", "green", "purple", "pink"];
