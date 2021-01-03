import { CreateNodeRequestData } from "./../../API/createNode/createNodeRequest";
import { EntityId } from "@reduxjs/toolkit";
import { ApplicationState } from "../../../../helpers";
import { addNode, personNodesLocalSelectors, setTree } from "../treeReducer";
import { RECT_WIDTH } from "../../../../d3/RectMapper";
export const addPartner = (
  sourceId: EntityId,
  partner: CreateNodeRequestData
) => (dispatch: any, getState: any) => {
  const state: ApplicationState = getState();
  const source = personNodesLocalSelectors.selectById(
    state.tree.nodes,
    sourceId
  );
  if (!source) {
    throw "Missing partner source " + sourceId;
  }
  partner.partners = [sourceId as number];
  partner.x = source.x + 2 * RECT_WIDTH;
  partner.y = source.y;

  dispatch(addNode(partner)).then((response: any) => {
    if (response.type === addNode.fulfilled.toString()) {
      dispatch(setTree(response.payload.data));
    }
  });
};
