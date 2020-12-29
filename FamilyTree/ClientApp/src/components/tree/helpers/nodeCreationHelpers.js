import {
  emptyNodeAttributs,
  rectangleAttributes,
} from "../../../d3/NodeAttributes";
import {
  deleteIcon,
  gearIcon,
  plusIcon,
  RECT_WIDTH,
} from "../../../d3/RectMapper";
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
export const addGearIcon = (nodes, clickHandler, hoverHandler) => {
  nodes
    .append("g")
    .append("path")
    .attr("d", gearIcon)
    .on("click", clickHandler)
    .on("mouseover", hoverHandler);
};
export const addPlusIcon = (nodes, handler) => {
  nodes
    .append("g")
    .append("path")
    .attr("d", plusIcon)
    .on("click", (event, d) => handler(d));
};

export const renderNodeCards = (node) => {
  // node
  //   .append("div")
  //   .attr("class", "card-rect")
  //   .each(function (d) {
  //     var u = d3.select(this);
  //     const attributes = d.isFamily ? emptyNodeAttributs : rectangleAttributes;
  //     for (const key in attributes) {
  //       u = u.style(key, attributes[key]);
  //     }
  //   });

  node
    .append("image")
    .attr(
      "href",
      "https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png"
    )
    .attr("height", 30)
    .attr("width", 30);

  //TODO weryfikacja id
  node
    .append("text")
    .attr("x", 10)
    .attr("y", 100)
    .text((d) => (d.isFamily ? "" : `${d.id}____23 May, 1956`));
  node
    .append("text")
    .attr("x", 72)
    .attr("y", 25)
    .text((d) => {
      var text = "";
      if (d.personDetails) {
        const { name, surname } = d.personDetails;
        text = `${name} ${surname}`;
      }
      return text;
    });
};

export const appendConnectionCircle = (node, clickHandler, hoverHandler) => {
  node
    .append("circle")
    .attr("r", 10)
    .attr("stroke", "red")
    .attr("fill", "white")
    .attr("cx", RECT_WIDTH / 2)
    .attr("cy", 0)
    .attr("fill-opacity", 0)
    .style("cursor", "pointer");

  node
    .append("circle")
    .attr("r", 5)
    .attr("stroke", "black")
    .attr("fill", "black")
    .attr("cx", RECT_WIDTH / 2)
    .attr("cy", 0)
    .style("cursor", "pointer")
    .attr("class", "visibleCircle");
};

export const renderFamilyNode = (nodes) => {
  nodes
    .append("circle")
    .attr("r", 10)
    .attr("stroke", "none")
    .attr("fill", "white")
    .style("cursor", "pointer")
    .attr("fill-opacity", 0);

  nodes
    .append("circle")
    .attr("r", 5)
    .attr("stroke", "black")
    .attr("fill", "black")
    .style("cursor", "pointer")
    .attr("class", "visibleCircle");
};
