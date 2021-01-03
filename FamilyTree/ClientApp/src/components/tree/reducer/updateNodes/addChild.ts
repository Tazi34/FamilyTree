import { CreateNodeRequestData } from "../../API/createNode/createNodeRequest";
import { EntityId } from "@reduxjs/toolkit";
import { ApplicationState } from "../../../../helpers";
import { addNode, personNodesLocalSelectors, setTree } from "../treeReducer";
import { RECT_HEIGHT, RECT_WIDTH } from "../../../../d3/RectMapper";
export const addChild = (
  child: CreateNodeRequestData,
  firstParentId: EntityId,
  secondParentId?: EntityId
) => (dispatch: any, getState: any) => {
  const state: ApplicationState = getState();
  const firstParent = personNodesLocalSelectors.selectById(
    state.tree.nodes,
    firstParentId
  );
  if (!firstParent) {
    throw "Missing first parent source " + firstParentId;
  }

  if (secondParentId) {
    const secondParent = personNodesLocalSelectors.selectById(
      state.tree.nodes,
      secondParentId
    );
    if (!secondParent) {
      throw "Missing second parent source " + secondParentId;
    }
    child.motherId = secondParentId as number;
  }

  child.fatherId = firstParentId as number;

  child.x = firstParent.x;
  child.y = firstParent.y + 2 * RECT_HEIGHT;

  dispatch(addNode(child)).then((response: any) => {
    if (response.type === addNode.fulfilled.toString()) {
      dispatch(setTree(response.payload.data));
    }
  });
};
