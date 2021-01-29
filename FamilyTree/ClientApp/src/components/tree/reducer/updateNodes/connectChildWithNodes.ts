import { createAsyncThunk, EntityId } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import {
  ConnectNodesRequestData,
  ConnectNodesResponse,
} from "../../API/connectNodes/connectNodesRequest";
import { treeAPI } from "../../API/treeAPI";
import { FamilyNode } from "../../../../model/FamilyNode";
import { Link } from "../../../../model/Link";
import {
  familyNodesAdapter,
  linksAdapter,
  personNodesLocalSelectors,
  selectPersonNodeLocal,
  setTree,
  TreeState,
} from "../treeReducer";
import { createLink } from "../utils/getOutboundLinks";
import { PersonNode } from "../../../../model/PersonNode";

export const connectNodes = (data: ConnectNodesRequestData) => (
  dispatch: any
) => {
  dispatch(connectNodesThunk(data)).then((response: any) => {
    if (response.type === connectNodesThunk.fulfilled.toString()) {
      dispatch(setTree(response.payload.data));
    }
  });
};
export const connectNodesThunk = createAsyncThunk<
  AxiosResponse<ConnectNodesResponse>,
  ConnectNodesRequestData
>("tree/nodes/connect", async (data) => {
  return treeAPI.connectNodesRequest(data);
});

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
    newFamily.fatherId = firstParentId;
    childrenNodes.forEach((childNode) => (childNode.fatherId = firstParentId));
    firstParent.children = childrenNodes.map((child) => child.id);
    firstParent.families.push(newFamily.id);
  }
  if (secondParent) {
    linksToAdd.push(createLink(secondParent, newFamily));
    newFamily.motherId = secondParentId;

    childrenNodes.forEach((childNode) => (childNode.fatherId = secondParentId));
    secondParent.children = childrenNodes.map((child) => child.id);
    secondParent.families.push(newFamily.id);
  }

  //dodawanie dzieci mozna wydzielic
  childrenNodes.forEach((childNode) => {
    linksToAdd.push(createLink(newFamily, childNode));
    // childNode.families.push(newFamily.id);
  });
  familyNodesAdapter.addOne(state.families, newFamily);
  linksAdapter.addMany(state.links, linksToAdd);
};
