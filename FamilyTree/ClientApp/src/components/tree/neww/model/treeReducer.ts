import { Person } from "./../../../../model/TreeStructureInterfaces";
import {
  createAction,
  createEntityAdapter,
  createReducer,
} from "@reduxjs/toolkit";
import { createActionWithPayload } from "../../../../helpers/helpers";
import { EntityState } from "@reduxjs/toolkit";
import { TreeStructure } from "../../../../model/TreeStructureInterfaces";
import { generateTreeStructures } from "../../../../d3/treeStructureGenerator";
export interface TreeState {
  nodes: EntityState<any>;
  links: EntityState<any>;
  families: EntityState<any>;
  initialTrees: TreeStructure[];
}
//TYPES
export type TreeNode = any;
export type FamilyNode = any;
export type Link = any;

//ADAPTERS
const treeNodesAdapter = createEntityAdapter<TreeNode>();
const familyNodesAdapter = createEntityAdapter<FamilyNode>();
const linksAdapter = createEntityAdapter<Link>();

//STATE
const initialState: TreeState = {
  nodes: treeNodesAdapter.getInitialState(),
  families: familyNodesAdapter.getInitialState(),
  links: linksAdapter.getInitialState(),
  initialTrees: [],
};

//ACTIONS
const actionNamePrefix = "tree";
const treeNodesPrefix = "nodes";
const familyNodesPrefix = "families";
const linksPrefix = "links";

const createTreeStructures = createActionWithPayload<Person[]>(
  `${actionNamePrefix}/treeStructureCreated`
);

const deleteNode = createActionWithPayload<string>(
  `${actionNamePrefix}/${treeNodesPrefix}/nodeDeleted`
);

const setTreeNodes = createActionWithPayload<TreeNode[]>(
  `${actionNamePrefix}/${treeNodesPrefix}/nodesSet`
);

const deleteLink = createActionWithPayload<string>(
  `${actionNamePrefix}/${linksPrefix}/linkDeleted`
);
const setLinks = createActionWithPayload<Link[]>(
  `${actionNamePrefix}/${linksPrefix}/linksSet`
);

const deleteFamily = createActionWithPayload<string>(
  `${actionNamePrefix}/${familyNodesPrefix}/familyDeleted`
);
const setFamilyNodes = createActionWithPayload<FamilyNode[]>(
  `${actionNamePrefix}/${familyNodesPrefix}/familiesSet`
);

//REDUCER
export const treeReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(deleteNode, (state, action) => {
      treeNodesAdapter.removeOne(state.nodes, action.payload);
    })
    .addCase(setTreeNodes, (state, action) => {
      treeNodesAdapter.setAll(state.nodes, action.payload);
    })
    .addCase(deleteFamily, (state, action) => {
      familyNodesAdapter.removeOne(state.families, action.payload);
    })
    .addCase(setFamilyNodes, (state, action) => {
      familyNodesAdapter.setAll(state.families, action.payload);
    })
    .addCase(deleteLink, (state, action) => {
      linksAdapter.removeOne(state.links, action.payload);
    })
    .addCase(setLinks, (state, action) => {
      linksAdapter.setAll(state.links, action.payload);
    })
    .addCase(createTreeStructures, (state, action) => {
      state.initialTrees = generateTreeStructures(action.payload);
    });
});
