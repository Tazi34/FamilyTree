import { getLinkId } from "../../helpers/idHelpers";
import { FamilyNode } from "../../../../model/FamilyNode";
import { Node } from "../../../../model/NodeClass";
import {
  TreeState,
  selectFamily,
  selectLinkLocal,
  selectPersonNodeLocal,
} from "../treeReducer";

import { Link } from "../../../../model/Link";
import { PersonNode } from "../../../../model/PersonNode";

export const getOutboundLinks = (state: TreeState, node: Node): Link[] => {
  var links: Link[] = [];
  if (!node.isFamily) {
    //szukamy rodziny gdzie jest rodzicem
    const families = (node as PersonNode).families
      .map((family) => selectFamily(state.families, family))
      .filter((f) => f) as FamilyNode[];

    const childFamilies = families.filter(
      (family) => family.fatherId === node.id || family.motherId === node.id
    );
    childFamilies.forEach((childFamily) => {
      if (childFamily) {
        const linkId = getLinkId(node.id, childFamily.id);
        const link = selectLinkLocal(state.links, linkId);
        if (link) {
          links.push(link);
        }
      }
    });
  } else {
    const foundLinks = node.children
      .map((childId) =>
        selectLinkLocal(state.links, getLinkId(node.id, childId))
      )
      .filter((a) => a) as Link[];
    links.push(...foundLinks);
  }

  return links;
};

export const getIncomingLinks = (state: TreeState, node: Node): Link[] => {
  var links: Link[] = [];

  if (!node.isFamily) {
    //szukamy rodziny gdzie jest dzieckiem
    const families = (node as PersonNode).families
      .map((family) => selectFamily(state.families, family))
      .filter((f) => f) as FamilyNode[];

    //rodzina w ktorej node jest dzieckiem
    const parentFamily = families.find((family) =>
      family.children.includes(node.id)
    );

    if (parentFamily) {
      const linkId = getLinkId(parentFamily.id, node.id);
      const link = selectLinkLocal(state.links, linkId);
      if (link) {
        return [link];
      } else {
        return [];
      }
    }
  } else {
    if (node.fatherId) {
      var id = getLinkId(node.fatherId, node.id);
      var link = selectLinkLocal(state.links, id);
      if (link) {
        links.push(link);
      }
    }
    if (node.motherId) {
      var link = selectLinkLocal(
        state.links,
        getLinkId(node.motherId, node.id)
      );
      if (link) {
        links.push(link);
      }
    }
    return links;
  }
  return [];
};
export const getNodeLinks = (state: TreeState, node: Node): Link[] => {
  return [...getIncomingLinks(state, node), ...getOutboundLinks(state, node)];
};
export const createLink = (source: Node, target: Node): Link => {
  var linkId = getLinkId(source.id, target.id);
  const link: Link = {
    id: linkId,
    source: source.id,
    target: target.id,
  };

  return link;
};
export const getLinkNodes = (state: TreeState, link: Link) => {
  return {
    sourceNode: getNodeById(state, link.source),
    targetNode: getNodeById(state, link.target),
  };
};
export const getNodeById = function (
  state: TreeState,
  id: string | number
): PersonNode | FamilyNode | undefined {
  if (!isInt(id)) {
    return selectFamily(state.families, id);
  }
  return selectPersonNodeLocal(state.nodes, id);
};

function isInt(value: any) {
  var x = parseFloat(value);
  return !isNaN(value) && (x | 0) === x;
}
