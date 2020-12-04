import { mapCollectionToEntity } from "./../../../../helpers/helpers";
import { store } from "./../../../../index";
import { ApplicationState } from "./../../../../helpers/index";
import { GetTreeStructures } from "./../../../../d3/treeStructureGenerator";
import { Family, Person } from "./../../../../model/TreeStructureInterfaces";
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
import {
  RECT_HEIGHT,
  RECT_WIDTH,
  X_SEP,
  Y_SEP,
} from "../../../../d3/RectMapper";
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
  otherNodes: EntityState<Node<any>>;
  nextFamilyId: number;
}

export interface TreeNode extends Node<Person> {
  id: number;
  families: string[];
}
export interface FamilyNode extends Node<Family> {
  id: string;
}
export type Link = {
  source: string | number;
  target: string | number;
  id: string;
};
export type Node<T = any> = {
  id: number | string;
  x: number;
  y: number;
  isVisible: boolean;
  isFamily: boolean;
  data: T;
  outboundLinks: Link[];
  incomingLinks: Link[];
  getLocation: Function;
  //TODO zmienic strukture - node ma children i rodzicow bez outbound/inboundlinks
  //TODO graphNumber: number;
};

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
  nextFamilyId: 0,
};

//SELECTORS
const { selectAll: selectAllLinksLocal } = linksAdapter.getSelectors(
  (state: EntityState<Link>) => state
);
const {
  selectAll: selectAllNodesLocal,
  selectById: selectNode,
} = treeNodesAdapter.getSelectors((state: EntityState<TreeNode>) => state);
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

export const changeNodePosition = createAction(
  `${actionNamePrefix}/nodeMoved`,
  (nodeId: number, location: Point): any => ({
    payload: { nodeId, location },
  })
);

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

export const addParent = createAction(
  `${actionNamePrefix}/${treeNodesPrefix}/parentAdded`,
  (sourceId: number, parent: Person): any => ({
    payload: { source: sourceId, parent },
  })
);
export const moveTreeNode = createAction(
  `${actionNamePrefix}/${treeNodesPrefix}/nodeMoved`,
  (node: Node, x: number, y: number): any => ({
    payload: { node, x, y },
  })
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
    var links: string[][] = [];
    var families: Family[] = [];

    var connectingNode = {
      id: "connecting_node",
    };

    trees.forEach((tree) => {
      var d3tree = d3
        .sugiyama()
        .nodeSize([100, 100])
        .layering(d3.layeringSimplex())
        .decross(d3.decrossOpt)
        .coord(d3.coordVert())
        .separation((a: any, b: any) => {
          return 1;
        });

      const dag = d3.dagConnect()(tree.links);
      d3tree(dag);
      var nodes = dag.descendants();

      roots.push(nodes.find((a: any) => a.layer == 0));
      links = [...links, ...tree.links];

      roots.forEach((root: any) => {
        links.push([connectingNode.id, root.id]);
      });
      families = [...families, ...tree.families];
    });

    var tree = d3
      .sugiyama()
      .nodeSize([X_SEP, Y_SEP])
      .layering(d3.layeringSimplex())
      .decross(d3.decrossOpt)
      .coord(d3.coordVert())
      .separation((a: any, b: any) => {
        return 1;
      });

    const dag = d3.dagConnect()(links);
    tree(dag);
    var d3Nodes = dag.descendants();
    var d3Links = dag.links();

    var familyNodes: FamilyNode[] = [];
    var peopleNodes: TreeNode[] = [];
    d3Nodes.forEach((n: any) => {
      var person = selectPersonByIdLocal(people, n.id);
      if (person) {
        const personNode = n as TreeNode;
        personNode.data = person.id;
        personNode.isFamily = false;
        personNode.isVisible = true;
        personNode.families = [];
        personNode.getLocation = getPersonNodeLocation;
        peopleNodes.push(personNode);
      } else {
        var family = families.find((a: any) => a.id == n.id);
        if (family) {
          const familyNode = n as FamilyNode;
          familyNode.data = family;
          familyNode.isFamily = true;
          familyNode.isVisible = true;
          familyNode.getLocation = getNodeLocation;
          familyNodes.push(familyNode);
        } else {
          n.isVisible = false;
        }
      }
      n.incomingLinks = [];
      n.outboundLinks = [];
    });
    otherNodes = d3Nodes.filter((n: Node) => !n.isFamily && !n.data);
    d3Links.forEach((l: any) => {
      l.id = getLinkId(l.source.id, l.target.id);
      l.source.outboundLinks.push(l);
      l.target.incomingLinks.push(l);
      l.source = l.source.id;
      l.target = l.target.id;
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
      var links = [...node.outboundLinks, ...node.incomingLinks];

      links.forEach((link) => {
        linksAdapter.removeOne(state.links, link.id);
        console.log(link);
        var targetedFamily = node.id == link.source ? link.target : link.source;

        if (targetedFamily != "connecting_node") {
          const family = selectFamily(state.families, targetedFamily);
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
    .addCase(addParent, (state, action: any) => {
      const sourceId = action.payload.source as number;
      const parent = action.payload.parent as Person;

      const sourceNode = selectNode(state.nodes, sourceId);
      if (!sourceNode) {
        return;
      }

      //ma obu rodzicow
      //TODO czy dopuszczac cos takieg? pewnie rzucic blad wyzej
      if (sourceNode.data.firstParent && sourceNode.data.secondParent) {
        return;
      }
      var newNode: TreeNode = {
        x: sourceNode.x + 100,
        y: sourceNode.y + 100,
        data: parent,
        isVisible: true,
        id: parent.id,
        outboundLinks: [],
        incomingLinks: [],
        isFamily: false,
        families: [],
        getLocation: getPersonNodeLocation,
        //TODO graphNumber: source.graphNumber,
      };
      var linksToAdd: Link[];

      if (sourceNode.data.firstParent || sourceNode.data.secondParent) {
        //ma juz jednego rodzica -> dodaj do rodziny

        const familyLink = sourceNode.incomingLinks[0];
        const familyId = familyLink.source;
        const family = selectFamily(state.families, familyId);
        if (family) {
          if (family.data.firstParent) {
            family.data.secondParent = newNode.id;
            sourceNode.data.secondParent = newNode.id;
            newNode.x = sourceNode.x + 2 * X_SEP;
          } else {
            sourceNode.data.firstParent = newNode.id;
            family.data.firstParent = newNode.id;
          }
          linksToAdd = [createLink(newNode, family)];
        } else {
          return;
        }
      } else {
        //nie ma rodzicow => utworz rodzine
        // TODO generator id rodziny
        // TODO pole graphnumber - brakuje, czy w ogole potrzebne?
        const id = `100u${Math.floor(Math.random() * 100000 + 1000)}`;

        var familyNode: FamilyNode = {
          id: id,
          data: {
            firstParent: newNode.id,
            secondParent: null,
            children: [sourceNode.id],
            id: id,
          },
          incomingLinks: [],
          outboundLinks: [],
          isFamily: true,
          isVisible: true,
          x: sourceNode.x,
          y: sourceNode.y - Y_SEP,
          getLocation: getNodeLocation,
        };

        newNode.x = familyNode.x - X_SEP;
        newNode.y = familyNode.y - Y_SEP;

        linksToAdd = [
          createLink(newNode, familyNode),
          createLink(familyNode, sourceNode),
        ];

        familyNodesAdapter.addOne(state.families, familyNode);
      }
      linksAdapter.addMany(state.links, linksToAdd);
      treeNodesAdapter.addOne(state.nodes, newNode);

      // peopleAdapter.addOne(state.people, parent);

      // //todo addLink(source,target) - z dodawaniem do outbound incoming
      // var newLink = createLink(newNode, source);

      // linksAdapter.addOne(state.links, newLink);
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
            person.firstParent = null;
          } else {
            firstParent!.children.push(id);
          }
        }

        if (person.secondParent) {
          secondParent = allPeopleEntities.find(
            (a) => a.id == person.secondParent
          );
          if (!secondParent) {
            person.secondParent = null;
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
      const families = selectAllFamiliesLocal(action.payload.families);
      families.forEach((node: FamilyNode) => {
        var familyMembers: number[] = [];
        const familyId = node.id;
        if (node.data.firstParent) {
          familyMembers.push(node.data.firstParent);
        }
        if (node.data.secondParent) {
          familyMembers.push(node.data.secondParent);
        }
        familyMembers = [...node.data.children, ...familyMembers];

        familyMembers.forEach((memberId) => {
          const memberNode = selectNode(action.payload.nodes, memberId);
          if (memberNode && !memberNode.families.includes(familyId)) {
            memberNode.families.push(familyId);
          }
        });
      });

      state.otherNodes = action.payload.otherNodes;
      state.isLoading = false;
      state.links = action.payload.links;
      state.nodes = action.payload.nodes;
      state.families = action.payload.families;
    })
    .addCase(moveTreeNode, (state, action: any) => {
      var { node, x, y } = action.payload;
      var nodeToMove = node.isFamily
        ? selectFamily(state.families, node.id)
        : selectNode(state.nodes, node.id);

      if (nodeToMove) {
        nodeToMove.x = x;
        nodeToMove.y = y;
      }
    });
});

const createLink = (source: Node, target: Node): Link => {
  var linkId = getLinkId(source.id, target.id);
  const link: Link = {
    id: linkId,
    source: source.id,
    target: target.id,
  };
  source.outboundLinks.push(link);
  target.incomingLinks.push(link);

  return link;
};
const getPersonNodeLocation = function (this: TreeNode): Point {
  return {
    x: this.x - RECT_WIDTH / 2,
    y: this.y - RECT_HEIGHT / 2,
  };
};
export const getNodeById = function (
  state: TreeState,
  id: string | number
): TreeNode | FamilyNode | undefined {
  if (!isNumeric(id)) {
    return selectFamily(state.families, id);
  }
  return selectNode(state.nodes, id);
};

export const getLinkNodes = (state: TreeState, link: Link) => {
  return {
    sourceNode: getNodeById(state, link.source),
    targetNode: getNodeById(state, link.target),
  };
};

const getNodeLocation = function (this: Node): Point {
  return {
    x: this.x,
    y: this.y,
  };
};

export interface Point {
  x: number;
  y: number;
}
function isNumeric(n: any) {
  return !isNaN(n) && isFinite(n);
}

const getNewFamilyId = (state: TreeState) => {};

export const familyIdGenerator = (
  state: TreeState,
  graphNumber: number
): string => {
  const id = `${graphNumber}u${state.nextFamilyId}`;
  state.nextFamilyId++;
  return id;
};
