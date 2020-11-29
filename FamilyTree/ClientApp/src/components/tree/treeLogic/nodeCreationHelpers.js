import {
  emptyNodeAttributs,
  rectangleAttributes,
} from "../../../d3/NodeAttributes";
import { deleteIcon, gearIcon, plusIcon } from "../../../d3/RectMapper";
import * as d3 from "d3";

export const addDeleteIcon = (nodes, handler) => {
  nodes
    .append("g")
    .attr("transform", `translate(${192}, ${60})scale(1.5)`)
    .append("path")
    .attr("d", deleteIcon)
    .on("click", (event, d) => {
      handler(d);
    });
};

export const renderNodeCards = (node) => {
  node
    .append("image")
    .attr(
      "href",
      "https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png"
    )
    .attr("height", 30)
    .attr("width", 30);
  node.append("rect").each(function (d) {
    var u = d3.select(this);
    const attributes = d.isFamily ? emptyNodeAttributs : rectangleAttributes;
    for (const key in attributes) {
      u = u.attr(key, attributes[key]);
    }
  });
  node.append("path").attr("d", gearIcon);
  node.append("path").attr("d", plusIcon);
  node
    .append("text")
    .attr("x", 10)
    .attr("y", 100)
    .text((d) => (d.isFamily ? "" : `${d.data.id}____23 May, 1956`));
  node
    .append("text")
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
};

export const renderFamilyNode = (nodes) => {
  nodes
    .append("circle")
    .attr("r", 40)
    .attr("stroke", "none")
    .attr("fill", "white")
    .attr("fill-opacity", 0);

  //   nodes
  //     .append("circle")
  //     .attr("r", 2)
  //     .attr("stroke", "black")
  //     .attr("fill", "black");
};
