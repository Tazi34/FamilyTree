import { createPath } from "../helpers/linkCreationHelpers";
import { FamilyNode, getFamilyLocation } from "../../../model/FamilyNode";
import { Link } from "../../../model/Link";
import { Node } from "../../../model/NodeClass";
import $ from "jquery";
import { Point } from "../../../model/Point";
import { TreeState } from "../reducer/treeReducer";
import {
  getIncomingLinks,
  getNodeById,
  getOutboundLinks,
} from "../reducer/utils/getOutboundLinks";
import { PersonNode } from "../../../model/PersonNode";

export default (
  e: any,
  node: Node,
  nodes: PersonNode[],
  families: FamilyNode[],
  treeState: TreeState
) => {
  const nodeFamilies = families.filter(
    (family) => family.fatherId === node.id || family.motherId === node.id
  );

  nodeFamilies.forEach((family) => {
    var familyLocation: Point;

    if (family.fatherId && family.motherId) {
      const nodeToLoadId =
        family.fatherId === node.id ? family.motherId : family.fatherId;
      const otherNode = nodes.find((n) => n.id === nodeToLoadId) as PersonNode;
      familyLocation = getFamilyLocation(family, { x: e.x, y: e.y }, otherNode);
    } else {
      familyLocation = getFamilyLocation(family, { x: e.x, y: e.y });
    }
    const familyNode = $("#" + family.id);
    familyNode.css(
      "transform",
      `translate(${familyLocation.x - 10}px,${familyLocation.y - 10}px)`
    );

    //Przesun wszystkie polaczenia rodziny
    const familyLinks = getOutboundLinks(treeState, family);
    familyLinks.forEach((link: Link) => {
      const otherNodelocation = getNodeById(treeState, link.target);
      let path: any;
      if (otherNodelocation) {
        if (otherNodelocation.id === node.id) {
          path = createPath(familyLocation.x, familyLocation.y, e.x, e.y);
        } else {
          path = createPath(
            familyLocation.x,
            familyLocation.y,
            otherNodelocation.x,
            otherNodelocation.y
          );
        }

        const linksvg = $("#" + link.id);
        linksvg.attr("d", path);
      }
    });
    const familyIncomingLinks = getIncomingLinks(treeState, family);

    familyIncomingLinks.forEach((link: Link) => {
      const otherNodelocation = getNodeById(treeState, link.source);
      if (otherNodelocation) {
        let path: any;
        if (otherNodelocation.id === node.id) {
          path = createPath(e.x, e.y, familyLocation.x, familyLocation.y);
        } else {
          path = createPath(
            otherNodelocation.x,
            otherNodelocation.y,
            familyLocation.x,
            familyLocation.y
          );
        }
        const linksvg = $("#" + link.id);
        linksvg.attr("d", path);
      }
    });
  });

  const outbondLinks = getOutboundLinks(treeState, node);

  outbondLinks
    .filter((link) => !nodeFamilies.find((family) => link.target === family.id))
    .forEach((link: Link) => {
      const otherNodelocation = getNodeById(treeState, link.target);
      if (otherNodelocation) {
        var path = createPath(
          e.x,
          e.y,
          otherNodelocation.x,
          otherNodelocation.y
        );

        const linksvg = $("#" + link.id);
        linksvg.attr("d", path);
      }
    });
  const incomingLinks = getIncomingLinks(treeState, node);

  incomingLinks.forEach((link: Link) => {
    const otherNodelocation = getNodeById(treeState, link.source);
    if (otherNodelocation) {
      var path = createPath(otherNodelocation.x, otherNodelocation.y, e.x, e.y);
      const linksvg = $("#" + link.id);
      linksvg.attr("d", path);
    }
  });
};
