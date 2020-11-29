import * as React from "react";
import { TreeStructure } from "../../model/TreeStructureInterfaces";
import {
  deleteIcon,
  gearIcon,
  plusIcon,
  RECT_HEIGHT,
  RECT_WIDTH,
} from "../../d3/RectMapper";
import data from "../../samples/multipleDisconnectedGraphs.js";
import {
  emptyNodeAttributs,
  rectangleAttributes,
} from "../../d3/NodeAttributes";
const d3_base = require("d3");
const d3_dag = require("d3-dag");
const d3 = Object.assign({}, d3_base, d3_dag);

type TreeRendererProps = {
  treeStructure: TreeStructure;
  getSvg: Function;
  rectWidth: number;
  rectHeight: number;
  onNodeDelete: Function;
};

class TreeRenderer extends React.Component<TreeRendererProps, {}> {
  private nodesGroup: React.RefObject<any>;
  constructor(props: TreeRendererProps) {
    super(props);
    this.nodesGroup = React.createRef();
  }

  updateTree = () => {
    console.log("update");
    const { rectWidth, rectHeight, treeStructure: structure } = this.props;
    var linksData = structure.links;

    const peopleCount = Object.keys(structure.people).length;
    if (peopleCount == 1) {
      var person = Object.keys(structure.people)[0];
      linksData = [[person, "fakeNode1"]];
    } else if (peopleCount == 0) {
      var person = Object.keys(structure.people)[0];
      linksData = [["fakeNode1", "fakeNode2"]];
    }

    console.log(structure);
    const g = d3.select(this.nodesGroup.current);
    g.attr("transform", "translate(-800,0)");
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
    var root = tree(dag);
    var nodes = dag.descendants();

    nodes.forEach((n: any) => {
      var data = structure.people[n.id];
      if (data) {
        n.data = data;
        n.isFamily = false;
      } else {
        if (structure.families.some((a: any) => a.id == n.id)) {
          n.isFamily = true;
        } else {
          n.isFamily = false;
          n.isFake = true;
        }
      }
    });

    const firstLayer = nodes.filter((a: any) => a.layer == 0);
    firstLayer[0].each((a: any) => {
      console.log(a);
    });
    var linksCanvas = g.append("g").attr("class", "links");
    var nodesCanvas = g.append("g").attr("class", "nodes");

    this.initializeNodes(nodesCanvas, root.descendants());
    this.initializeLinks(linksCanvas, root.links());
  };

  initializeNodes = (nodes: any, data: any) => {
    var g = nodes
      .selectAll()
      .data(data)
      .enter()
      .append("g")
      .filter((d: any) => !d.isFamily && !d.isFake);

    g.attr(
      "transform",
      (d: any) => `translate(${d.x - RECT_WIDTH / 2},${d.y - RECT_HEIGHT / 2})`
    );

    g.append("image")
      .attr(
        "href",
        "https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png"
      )
      .attr("height", 30)
      .attr("width", 30);
    g.append("rect")
      .classed("node", true)
      .each(function (this: any, d: any) {
        var u = d3.select(this);
        const attributes = d.isFamily
          ? emptyNodeAttributs
          : rectangleAttributes;
        for (const key in attributes) {
          u = u.attr(key, attributes[key]);
        }
      });
    g.append("path").attr("d", gearIcon);
    g.append("path").attr("d", plusIcon);
    g.append("text")
      .attr("x", 10)
      .attr("y", 100)
      .text((d: any) => {
        return d.isFamily ? "" : d.data.information.id + "  23 May, 1956";
      });
    g.append("text")
      .attr("x", 72)
      .attr("y", 25)
      .text((d: any) => {
        var text = "";
        if (d.data.information) {
          const { name, surname } = d.data!.information;
          text = `${name} ${surname}`;
        }
        return text;
      });

    const nodesThatCanBeDeleted = g.filter((d: any) => d.data.canBeDeleted);

    nodesThatCanBeDeleted
      .append("g")
      .attr("transform", `translate(${192}, ${60})scale(1.5)`)
      .append("path")
      .attr("d", deleteIcon)
      .on("click", (event: any, d: any) => {
        this.props.onNodeDelete(d.id);
      });
    nodes.selectAll("circle.node").data(data).enter();

    return nodes;
  };
  initializeLinks = (links: any, data: any): any => {
    var lineGenerator = d3.line();

    links
      .selectAll("line.link")
      .data(data)
      .enter()
      .each(function (this: any, d: any) {
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
          .append("path")
          .attr("d", pathData)
          .attr("stroke", "#000")
          .attr("stroke-width", 1);
      });
    return links;
  };
  componentDidMount = () => {
    this.updateTree();
  };
  componentDidUpdate = () => {
    this.updateTree();
  };
  render() {
    return <g ref={this.nodesGroup} key={Math.random().toString()}></g>;
  }
}

export default TreeRenderer;
