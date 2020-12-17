import { treeNodeMapper } from "../../API/utils/NodeMapper";
import {
  UpdateNodeRequestData,
  updateTreeNode,
} from "../../API/updateNode/updateNodeRequest";
import { createAction, EntityId } from "@reduxjs/toolkit";

import {
  familyNodesAdapter,
  linksAdapter,
  personNodesLocalSelectors,
  selectPersonNodeLocal,
  treeActionsPrefix,
  TreeState,
} from "../treeReducer";

import { Link } from "../../model/Link";
import { PersonNode } from "../../model/PersonNode";
import { FamilyNode } from "../../model/FamilyNode";
import { createLink } from "../utils/getOutboundLinks";

export const connectAsChild = createAction(
  `${treeActionsPrefix}/parentConnected`,
  (childId: EntityId, parentId: EntityId): any => ({
    payload: { childId, parentId },
  })
);
export const connectAsChildAsync = (childId: EntityId, parentId: EntityId) => (
  dispatch: any,
  getState: any
) => {
  const state = getState();
  const child = personNodesLocalSelectors.selectById(state.tree.nodes, childId);
  if (!child) {
    throw "Unrecognized child node " + childId;
  }

  const updateNodeData: UpdateNodeRequestData = treeNodeMapper.mapToAPI(child);
  updateNodeData.fatherId = parentId as number;

  return updateTreeNode(updateNodeData).then(() =>
    dispatch(connectAsChild(childId, parentId))
  );
};

export const addFamily = (
  state: TreeState,
  familyId: EntityId,
  firstParentId: EntityId | null,
  secondParentId: EntityId | null,
  children: EntityId[]
) => {
  const childrenNodes = children
    .map((child) => personNodesLocalSelectors.selectById(state.nodes, child))
    .filter((a) => a) as PersonNode[];

  if (childrenNodes.length !== children.length) {
    //TODO komunikat jakie dzieci
    throw "Unrecognized child";
  }
  if (!firstParentId && !secondParentId) {
    throw "Missing parents";
  }

  const linksToAdd: Link[] = [];

  var firstParent: PersonNode | undefined = undefined;
  var secondParent: PersonNode | undefined = undefined;

  if (firstParentId) {
    firstParent = selectPersonNodeLocal(state.nodes, firstParentId);
  }
  if (secondParentId) {
    secondParent = selectPersonNodeLocal(state.nodes, secondParentId);
  }
  if (!firstParent && !secondParent) {
    throw "Missing parents";
  }

  const treeId = firstParent ? firstParent.treeId : secondParent!.treeId;
  const newFamily = new FamilyNode(
    familyId,
    treeId,
    0,
    0,
    children,
    firstParentId,
    secondParentId
  );

  //dodawanie rodzica mozna wydzielic
  if (firstParent) {
    linksToAdd.push(createLink(firstParent, newFamily));
    newFamily.firstParent = firstParentId;
    childrenNodes.forEach(
      (childNode) => (childNode.firstParent = firstParentId)
    );
    firstParent.children = childrenNodes.map((child) => child.id);
    firstParent.families.push(newFamily.id);
  }
  if (secondParent) {
    linksToAdd.push(createLink(secondParent, newFamily));
    newFamily.secondParent = secondParentId;

    childrenNodes.forEach(
      (childNode) => (childNode.firstParent = secondParentId)
    );
    secondParent.children = childrenNodes.map((child) => child.id);
    secondParent.families.push(newFamily.id);
  }

  //dodawanie dzieci mozna wydzielic
  childrenNodes.forEach((childNode) => {
    linksToAdd.push(createLink(newFamily, childNode));
    childNode.families.push(newFamily.id);
  });
  familyNodesAdapter.addOne(state.families, newFamily);
  linksAdapter.addMany(state.links, linksToAdd);
};
