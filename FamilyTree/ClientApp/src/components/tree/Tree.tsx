import React, { Component } from "react";
// import { mainNode } from "./D3Tree";
import { mainNode } from "./d3-dag/test";
var _ = require("lodash");
const dTree = require("d3-dtree");
interface State {
  d3: any;
}
interface Props {}

const rd3 = require("react-d3-library");
const RD3Component = rd3.Component;

class Tree extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = { d3: null };
  }
  componentDidMount() {
    this.setState({ d3: mainNode });
  }

  render() {
    return (
      <div id="graph">
        <RD3Component data={this.state.d3} />
      </div>
    );
  }
}

export default Tree;

const treeData = [
  {
    name: "Top Level",
    parent: "null",
    value: 10,
    type: "black",
    level: "red",
    children: [
      {
        name: "Level 2: A",
        parent: "Top Level",
        value: 15,
        type: "grey",
        level: "red",
        children: [
          {
            name: "Son of A",
            parent: "Level 2: A",
            value: 5,
            type: "steelblue",
            level: "orange",
          },
          {
            name: "Daughter of A",
            parent: "Level 2: A",
            value: 8,
            type: "steelblue",
            level: "red",
          },
        ],
      },
      {
        name: "Level 2: B",
        parent: "Top Level",
        value: 10,
        type: "grey",
        level: "green",
      },
    ],
  },
];
