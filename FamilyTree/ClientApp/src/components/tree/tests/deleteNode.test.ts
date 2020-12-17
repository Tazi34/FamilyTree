import configureStore from "redux-mock-store"; //ES6 modules
import { ApplicationState } from "../../../helpers";
import { mapCollectionToEntity } from "../../../helpers/helpers";
import { initialAppState } from "../../../helpers/index";
import { createMockFamily } from "../../../helpers/testUtils";
import { PersonNode } from "../model/PersonNode";
import {
  selectAllFamiliesLocal,
  selectAllPersonNodesLocal,
  treeReducer,
} from "../reducer/treeReducer";

const setupState = () => {
  const state = initialAppState;
  const familyId = "u1";
  const { family, people, links } = createMockFamily(1, 2, [3, 4], familyId);

  state.tree.families = mapCollectionToEntity([family]);
  state.tree.links = mapCollectionToEntity(links);
  state.tree.nodes = mapCollectionToEntity(people);
  return state;
};

describe("delete-node", () => {
  var state: ApplicationState;
  beforeEach(() => {
    state = setupState();
  });

  it("deleting child from family with more than one child should remove link", () => {
    //Arrange
    const child = state.tree.nodes.entities[3] as PersonNode;

    //Act
    const newState = treeReducer(state.tree, deleteNode(child));

    const nodes = selectAllPersonNodesLocal(newState.nodes);

    const previousLinksCount = state.tree.links.ids.length;
    const currentLinksCount = newState.links.ids.length;

    expect(nodes.length).toBe(3);
    expect(currentLinksCount).toBe(previousLinksCount - 1);
  });

  it("deleting node should remove node from nodes", () => {
    //Arrange
    const nodeToDelete = state.tree.nodes.entities[3] as PersonNode;

    const newState = treeReducer(state.tree, deleteNode(nodeToDelete));

    const deletedNodeId = nodeToDelete.id;
    const foundNode = newState.nodes.entities[deletedNodeId];

    expect(foundNode).toBeUndefined();
  });

  it("deleting child should remove node from family", () => {
    const nodeToDelete = state.tree.nodes.entities[3] as PersonNode;

    const newState = treeReducer(state.tree, deleteNode(nodeToDelete));

    const deletedNodeId = nodeToDelete.id;
    const family = selectAllFamiliesLocal(newState.families)[0];

    const familyChildren = family.children;
    expect(
      familyChildren.find((childId) => childId == deletedNodeId)
    ).toBeUndefined();
  });

  it("deleting first parent should remove node from family", () => {
    const nodeToDelete = state.tree.nodes.entities[1] as PersonNode;

    const newState = treeReducer(state.tree, deleteNode(nodeToDelete));

    const family = selectAllFamiliesLocal(newState.families)[0];

    expect(family.firstParent).toBeNull();
  });

  it("deleting second parent should remove node from family", () => {
    const nodeToDelete = state.tree.nodes.entities[2] as PersonNode;

    const newState = treeReducer(state.tree, deleteNode(nodeToDelete));

    const family = selectAllFamiliesLocal(newState.families)[0];

    expect(family.secondParent).toBeNull();
  });
});
