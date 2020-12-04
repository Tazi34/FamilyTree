import { FamilyNode } from "./treeReducer";
import { mapCollectionToEntity } from "./../../../../helpers/helpers";
import { store } from "./../../../../index";
import { ApplicationState } from "./../../../../helpers/index";
import { GetTreeStructures } from "./../../../../d3/treeStructureGenerator";
import { Person } from "./../../../../model/TreeStructureInterfaces";
import names from "./../../../../samples/names.json";
import surnames from "./../../../../samples/surnames.json";

import {
  createAction,
  createAsyncThunk,
  createEntityAdapter,
  createReducer,
} from "@reduxjs/toolkit";
import { createActionWithPayload } from "../../../../helpers/helpers";
import { EntityState } from "@reduxjs/toolkit";
import { TreeStructure } from "../../../../model/TreeStructureInterfaces";
import Axios, { AxiosResponse } from "axios";
import { baseURL } from "../../../../helpers/apiHelpers";
import { getLinkId } from "../../treeLogic/idHelpers";
import { json } from "d3";
const d3_base = require("d3");
const d3_dag = require("d3-dag");
const d3 = Object.assign({}, d3_base, d3_dag);

//TYPES
export interface TreeState {
  nodes: EntityState<TreeNode>;
  links: EntityState<Link>;
  families: EntityState<FamilyNode>;
  initialTrees: TreeStructure[];
  people: EntityState<Person>;
  isLoading: boolean;
  otherNodes: EntityState<Node>;
}
export interface TreeNode extends Node {}
export interface FamilyNode extends Node {}
export type Link = any;
export type Node = any;

//ADAPTERS
export const otherNodesAdapter = createEntityAdapter<Node>();
export const treeNodesAdapter = createEntityAdapter<TreeNode>();
export const familyNodesAdapter = createEntityAdapter<FamilyNode>();
export const linksAdapter = createEntityAdapter<Link>({
  selectId: (link: Link) => link.id,
});
export const peopleAdapter = createEntityAdapter<Person>();
//STATE
const initialState: TreeState = {
  nodes: treeNodesAdapter.getInitialState(),
  families: familyNodesAdapter.getInitialState(),
  links: linksAdapter.getInitialState(),
  initialTrees: [],
  otherNodes: otherNodesAdapter.getInitialState(),
  people: peopleAdapter.getInitialState(),
  isLoading: false,
};

//SELECTORS
const { selectAll: selectAllLinksLocal } = linksAdapter.getSelectors(
  (state: EntityState<Link>) => state
);
const {
  selectAll: selectAllFamiliesLocal,
  selectById: selectFamily,
} = familyNodesAdapter.getSelectors((state: EntityState<FamilyNode>) => state);
const {
  selectAll: selectAllPeopleLocal,
  selectById: selectPersonByIdLocal,
} = peopleAdapter.getSelectors((state: EntityState<Person>) => state);
//GLOBAL SELECTORS

export const { selectAll: selectAllNodes } = treeNodesAdapter.getSelectors(
  (state: ApplicationState) => state.tree.nodes
);
export const { selectAll: selectAllFamilies } = familyNodesAdapter.getSelectors(
  (state: ApplicationState) => state.tree.families
);
export const { selectAll: selectAllLinks } = linksAdapter.getSelectors(
  (state: ApplicationState) => state.tree.links
);

export const {
  selectAll: selectAllPeopleInCurrentTree,
} = peopleAdapter.getSelectors((state: ApplicationState) => state.tree.people);

//ACTIONS
const actionNamePrefix = "tree";
const treeNodesPrefix = "nodes";
const familyNodesPrefix = "families";
const linksPrefix = "links";

export const deleteNode = createActionWithPayload<TreeNode>(
  `${actionNamePrefix}/${treeNodesPrefix}/nodeDeleted`
);

export const setTreeNodes = createActionWithPayload<TreeNode[]>(
  `${actionNamePrefix}/${treeNodesPrefix}/nodesSet`
);

export const deleteLink = createActionWithPayload<string>(
  `${actionNamePrefix}/${linksPrefix}/linkDeleted`
);
export const setLinks = createActionWithPayload<Link[]>(
  `${actionNamePrefix}/${linksPrefix}/linksSet`
);

export const deleteFamily = createActionWithPayload<string>(
  `${actionNamePrefix}/${familyNodesPrefix}/familyDeleted`
);
export const setFamilyNodes = createActionWithPayload<FamilyNode[]>(
  `${actionNamePrefix}/${familyNodesPrefix}/familiesSet`
);

export const getTreePeople = createAsyncThunk(
  `${actionNamePrefix}/peopleSet`,
  async (id): Promise<AxiosResponse> => {
    return Axios.get(`${baseURL}/trees/${id}`);
  }
);

export const createD3TreeInstance = createAction(
  `${actionNamePrefix}/d3TreeCreated`,
  function (
    people: EntityState<Person>,
    nodeWidth: number,
    nodeHeight: number
  ): any {
    //TODO Rozwiazac problem niemutowalnosci - prawdopodobnie przepisac calosc
    //dane wejsciowe to inny typ niz wyjsciowe, wyjsciowe wiecej pol
    const peopleArray = peopleAdapter.getSelectors().selectAll(people);
    var copy = peopleArray.map((p) => JSON.parse(JSON.stringify(p)));

    copy.forEach((p) => {
      p.information.name = names[p.id];
      p.information.surname = surnames[p.id];
    });
    var peopleEntitiesCopy = mapCollectionToEntity(copy, null);

    const trees = GetTreeStructures(peopleEntitiesCopy);
    var otherNodes = [];
    var roots: any = [];
    var links: Link[] = [];
    var families: FamilyNode[] = [];

    var connectingNode = {
      id: "connecting_node",
    };

    trees.forEach((tree) => {
      var linksData = selectAllLinksLocal(tree.links).map(
        (link) => link.relation
      );
      var d3tree = d3
        .sugiyama()
        .nodeSize([100, 100])
        .layering(d3.layeringSimplex())
        .decross(d3.decrossOpt)
        .coord(d3.coordVert())
        .separation((a: any, b: any) => {
          return 1;
        });

      const dag = d3.dagConnect()(linksData);
      d3tree(dag);
      var nodes = dag.descendants();

      roots.push(nodes.find((a: any) => a.layer == 0));
      links = [...links, ...selectAllLinksLocal(tree.links)];

      roots.forEach((root: any) => {
        links.push({
          relation: ["connecting_node", root.id],
          id: getLinkId("connecting_node", root.id),
        });
      });
      families = [...families, ...selectAllFamiliesLocal(tree.families)];
    });
    var x_sep = nodeWidth + 50,
      y_sep = nodeHeight + 100;
    var tree = d3
      .sugiyama()
      .nodeSize([x_sep, y_sep])
      .layering(d3.layeringSimplex())
      .decross(d3.decrossOpt)
      .coord(d3.coordVert())
      .separation((a: any, b: any) => {
        return 1;
      });

    const linksRelations = links.map((l) => l.relation);
    const dag = d3.dagConnect()(linksRelations);
    tree(dag);
    var d3Nodes = dag.descendants();
    var d3Links = dag.links();

    var familyNodes: FamilyNode[] = [];
    var peopleNodes: TreeNode[] = [];
    d3Nodes.forEach((n: any) => {
      var person = selectPersonByIdLocal(people, n.id);
      if (person) {
        n.data = person;
        n.isFamily = false;
        n.isVisible = true;
        peopleNodes.push(n);
      } else {
        var family = families.find((a: any) => a.id == n.id);
        if (family) {
          n.data = family;
          n.isFamily = true;
          n.isVisible = true;
          familyNodes.push(n);
        } else {
          n.isVisible = false;
        }
      }
      n.targetLinks = [];
      n.sourceLinks = [];
    });
    otherNodes = d3Nodes.filter((n: Node) => !n.isFamily && !n.data);
    d3Links.forEach((l: any) => {
      l.id = getLinkId(l.source.id, l.target.id);
      l.source.sourceLinks.push(l);
      l.target.targetLinks.push(l);
    });
    return {
      payload: {
        families: mapCollectionToEntity(familyNodes, familyNodesAdapter),
        nodes: mapCollectionToEntity(peopleNodes, treeNodesAdapter),
        links: mapCollectionToEntity(d3Links, linksAdapter),
        otherNodes: mapCollectionToEntity(otherNodes, otherNodesAdapter),
      },
    };
  }
);

//REDUCER
export const treeReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(deleteNode, (state, action) => {
      const node = action.payload;

      //usun z svg
      //treeNodesAdapter.removeOne(state.nodes, node.id);
      var links = [...node.sourceLinks, ...node.targetLinks];

      links.forEach((link) => {
        linksAdapter.removeOne(state.links, link.id);
        console.log(link);
        var targetedFamily =
          node.id == link.source.id ? link.target : link.source;

        if (targetedFamily.id != "connecting_node") {
          const family = selectFamily(state.families, targetedFamily.id);
          if (family) {
            const familyData = family.data;

            const id = node.id;
            if (familyData.firstParent == id) {
              familyData.firstParent = null;
            } else if (familyData.secondParent == id) {
              familyData.secondParent = null;
            } else {
              familyData.children = familyData.children.filter(
                (a: any) => a != id
              );
            }
            if (
              (!familyData.firstParent && !familyData.secondParent) ||
              familyData.children.length == 0
            ) {
              var linksToDelete = [
                getLinkId(node.id, familyData.id),
                getLinkId(familyData.firstParent, familyData.id),
                getLinkId(familyData.secondParent, familyData.id),
                ...familyData.children.map((c: number) =>
                  getLinkId(familyData.id, c)
                ),
              ];
              familyNodesAdapter.removeOne(state.families, familyData.id);

              linksAdapter.removeMany(state.links, linksToDelete);
            }
          }
        }
      });
      treeNodesAdapter.removeOne(state.nodes, action.payload.id);
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
    .addCase(getTreePeople.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getTreePeople.rejected, (state) => {
      state.isLoading = false;
    })
    .addCase(getTreePeople.fulfilled, (state, action) => {
      //start empty
      var allPeopleEntities: Person[] = action.payload.data.people;
      console.log(allPeopleEntities);
      allPeopleEntities
        .filter((p) => p)
        .forEach((p) => {
          p!.children = [];
          p!.families = [];
          p!.partners = [];
        });
      //Categorize partners and children
      allPeopleEntities.forEach((person: Person) => {
        const { id } = person;

        var firstParent: Person | undefined;
        var secondParent: Person | undefined;
        if (person.firstParent) {
          firstParent = allPeopleEntities.find(
            (a) => a.id == person.firstParent
          );
          if (!firstParent) {
            person.firstParent = undefined;
          } else {
            firstParent!.children.push(id);
          }
        }

        if (person.secondParent) {
          secondParent = allPeopleEntities.find(
            (a) => a.id == person.secondParent
          );
          if (!secondParent) {
            person.secondParent = undefined;
          } else {
            secondParent!.children.push(id);
          }
        }
        if (firstParent && secondParent) {
          if (!firstParent!.partners.includes(secondParent.id)) {
            firstParent!.partners.push(secondParent.id);
          }
          if (!secondParent!.partners.includes(firstParent.id)) {
            secondParent!.partners.push(firstParent.id);
          }
        }
      });
      state.people = mapCollectionToEntity(allPeopleEntities, null);
    })
    .addCase(createD3TreeInstance, (state, action: any) => {
      //TODO problem z wyborem id przez setAll
      state.otherNodes = action.payload.otherNodes;
      state.isLoading = false;
      state.links = action.payload.links;
      state.nodes = action.payload.nodes;
      state.families = action.payload.families;
    });
});
