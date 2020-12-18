import { Link } from "../../model/Link";
import { FamilyNode } from "./../../model/FamilyNode";
import { X_SEP, Y_SEP } from "./../../../../d3/RectMapper";
import { createAction, EntityId } from "@reduxjs/toolkit";
import { ApplicationState } from "../../../../helpers/index";
import {
  CreateNodeRequestData,
  CreateNodeResponse,
} from "../../API/createNode/createNodeRequest";
import { treeNodeMapper } from "../../API/utils/NodeMapper";
import { PersonNode } from "../../model/PersonNode";
import {
  addNode,
  familyNodesAdapter,
  linksAdapter,
  personNodesActionsPrefix,
  personNodesAdapter,
  personNodesLocalSelectors,
  selectFamily,
  selectPersonNodeLocal,
  treeActionsPrefix,
  TreeState,
} from "../treeReducer";
import {
  createLink,
  getIncomingLinks,
  randomFamilyId,
} from "../utils/getOutboundLinks";
import { WritableDraft } from "immer/dist/internal";

type AddParentPayload = {
  payload: {
    source: number;
    createdParentId: number;
  };
};
export const addParent = createAction<
  (sourceId: number, createdParentId: number) => AddParentPayload
>(
  `${treeActionsPrefix}/${personNodesActionsPrefix}/parentAdded`,
  (sourceId, createdParentId) => ({
    payload: { source: sourceId, createdParentId },
  })
);
export const addParentAsync = (
  sourceId: EntityId,
  parent: CreateNodeRequestData
) => (dispatch: any, getState: any) => {
  const state: ApplicationState = getState();
  const child = personNodesLocalSelectors.selectById(
    state.tree.nodes,
    sourceId
  );
  if (!child) {
    throw "Missing child " + sourceId;
  }

  parent.children = [sourceId as number];
  dispatch(addNode(parent)).then((response: any) => {
    if (response.type === addNode.fulfilled.toString()) {
      dispatch(addParent(sourceId as number, response.payload.data.nodeId));
    }
  });
};

export const addParentReducerHandler = (
  state: WritableDraft<TreeState>,
  action: AddParentPayload
) => {
  const sourceId = action.payload.source as number;
  const parentId = action.payload.createdParentId;

  const sourceNode = selectPersonNodeLocal(state.nodes, sourceId);
  if (!sourceNode) {
    throw "Missing source node " + sourceId;
  }

  //ma obu rodzicow
  //TODO czy dopuszczac cos takieg? pewnie rzucic blad wyzej
  if (sourceNode.fatherId && sourceNode.motherId) {
    throw "Both parents are already present";
  }

  var parent = selectPersonNodeLocal(state.nodes, parentId);
  if (!parent) {
    throw "Missing parent";
  }

  var linksToAdd: Link[];

  if (sourceNode.fatherId || sourceNode.motherId) {
    //ma juz jednego rodzica -> dodaj do rodziny

    const familyLink = getIncomingLinks(state, sourceNode)[0];
    const familyId = familyLink.source;
    const family = selectFamily(state.families, familyId);
    if (family) {
      if (family.fatherId) {
        family.motherId = parent.id;
        sourceNode.motherId = parent.id;
        parent.location.x = sourceNode.location.x + X_SEP;
      } else {
        family.fatherId = parent.id;
        sourceNode.fatherId = parent.id;
        parent.location.x = sourceNode.location.x - X_SEP;
      }
      parent.location.y = family.location.y - Y_SEP;
      parent.families.push(family.id);

      linksToAdd = [createLink(parent, family)];
    } else {
      return;
    }
  } else {
    const id = randomFamilyId();

    var familyNode: FamilyNode = new FamilyNode(
      id,
      sourceNode.treeId,
      sourceNode.location.x,
      sourceNode.location.y - Y_SEP,
      [sourceNode.id],
      parent.id
    );

    parent.location.x = familyNode.location.x - X_SEP;
    parent.location.y = familyNode.location.y - Y_SEP;

    linksToAdd = [
      createLink(parent, familyNode),
      createLink(familyNode, sourceNode),
    ];
    sourceNode.families.push(familyNode.id);
    sourceNode.fatherId = parent.id;
    familyNodesAdapter.addOne(state.families, familyNode);
    parent.families.push(familyNode.id);
  }
  parent.children.push(sourceNode.id);

  linksAdapter.addMany(state.links, linksToAdd);
  personNodesAdapter.addOne(state.nodes, parent);
};
