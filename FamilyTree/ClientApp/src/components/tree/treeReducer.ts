import { treeNodeMapper } from "./API/utils/NodeMapper";
import { UpdateNodeRequestData } from "./API/updateNode/updateNodeRequest";
import { treeAPI } from "./API/treeAPI";
import {
  CreateNodeResponse,
  CreateNodeRequestData,
} from "./API/createNode/createNodeRequest";
import {
  createAction,
  createAsyncThunk,
  createDraftSafeSelector,
  createEntityAdapter,
  createReducer,
  EntityId,
  EntityState,
} from "@reduxjs/toolkit";
import Axios, { AxiosResponse } from "axios";
import { X_SEP, Y_SEP } from "../../d3/RectMapper";
import { GetTreeStructures } from "../../d3/treeStructureGenerator";
import { baseURL } from "../../helpers/apiHelpers";
import {
  createActionWithPayload,
  mapCollectionToEntity,
} from "../../helpers/helpers";
import { ApplicationState } from "../../helpers/index";
import { TreeInformation } from "../../model/TreeInformation";
import { Family, Person } from "../../model/TreeStructureInterfaces";
import { selectSelf } from "../loginPage/authenticationReducer";
import { isGraphCyclic } from "./graphAlgorithms/cycleDetection";
import { getLinkId } from "./helpers/idHelpers";
import { FamilyNode } from "./model/FamilyNode";
import { Node } from "./model/NodeClass";
import { PersonInformation, PersonNode } from "./model/PersonNode";
import { GetTreeResponse } from "./API/getTree/getTreeRequest";

const d3_base = require("d3");
const d3_dag = require("d3-dag");
const d3 = Object.assign({}, d3_base, d3_dag);

//TYPES
export type TreeState = {
  nodes: EntityState<PersonNode>;
  links: EntityState<Link>;
  families: EntityState<FamilyNode>;
  isLoading: boolean;
  nextFamilyId: number;
  treeId: EntityId | null;
};

export class Link {
  source: EntityId;
  target: EntityId;
  id: string;

  constructor(source: EntityId, target: EntityId) {
    this.id = getLinkId(source, target);
    this.source = source;
    this.target = target;
  }
}

//ADAPTERS
export const personNodesAdapter = createEntityAdapter<PersonNode>();
export const familyNodesAdapter = createEntityAdapter<FamilyNode>();
export const linksAdapter = createEntityAdapter<Link>({
  selectId: (link: Link) => link.id,
});
export const peopleAdapter = createEntityAdapter<Person>();
//STATE
export const treeInitialState: TreeState = {
  nodes: personNodesAdapter.getInitialState(),
  families: familyNodesAdapter.getInitialState(),
  links: linksAdapter.getInitialState(),
  isLoading: false,
  nextFamilyId: 0,
  treeId: null,
};

//SELECTORS
export const {
  selectAll: selectAllLinksLocal,
  selectById: selectLinkLocal,
} = linksAdapter.getSelectors((state: EntityState<Link>) => state);
export const {
  selectAll: selectAllPersonNodesLocal,
  selectById: selectPersonNodeLocal,
} = personNodesAdapter.getSelectors((state: EntityState<PersonNode>) => state);
export const {
  selectAll: selectAllFamiliesLocal,
  selectById: selectFamily,
} = familyNodesAdapter.getSelectors((state: EntityState<FamilyNode>) => state);
export const {
  selectAll: selectAllPeopleLocal,
  selectById: selectPersonByIdLocal,
} = peopleAdapter.getSelectors((state: EntityState<Person>) => state);

export const personNodesLocalSelectors = personNodesAdapter.getSelectors(
  (state: EntityState<PersonNode>) => state
);
export const familyNodesLocalSelectors = familyNodesAdapter.getSelectors(
  (state: EntityState<FamilyNode>) => state
);
export const linksLocalSelectors = linksAdapter.getSelectors(
  (state: EntityState<Link>) => state
);
export const selectAllNodesLocal = createDraftSafeSelector<
  ApplicationState,
  ApplicationState,
  Node[]
>(selectSelf, (state) => [
  ...selectAllPersonNodes(state),
  ...selectAllFamilies(state),
]);
// GLOBAL SELECTORS

export const {
  selectAll: selectAllPersonNodes,
} = personNodesAdapter.getSelectors(
  (state: ApplicationState) => state.tree.nodes
);
export const { selectAll: selectAllFamilies } = familyNodesAdapter.getSelectors(
  (state: ApplicationState) => state.tree.families
);
export const { selectAll: selectAllLinks } = linksAdapter.getSelectors(
  (state: ApplicationState) => state.tree.links
);

//ACTIONS
const actionNamePrefix = "tree";
const PersonNodesPrefix = "nodes";
const familyNodesPrefix = "families";
const linksPrefix = "links";

export const changeNodePosition = createAction(
  `${actionNamePrefix}/nodeMoved`,
  (nodeId: number, location: Point): any => ({
    payload: { nodeId, location },
  })
);
export const connectAsChild = createAction(
  `${actionNamePrefix}/parentConnected`,
  (childId: EntityId, parentId: EntityId): any => ({
    payload: { childId, parentId },
  })
);
export const connectToFamily = createAction(
  `${actionNamePrefix}/connectedToFamily`,
  (childId: EntityId, familyId: EntityId): any => ({
    payload: { childId, familyId },
  })
);
export const deleteNode = createActionWithPayload<PersonNode>(
  `${actionNamePrefix}/${PersonNodesPrefix}/nodeDeleted`
);

export const setPersonNodes = createActionWithPayload<PersonNode[]>(
  `${actionNamePrefix}/${PersonNodesPrefix}/nodesSet`
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

export const getTree = createAsyncThunk<AxiosResponse<GetTreeResponse>, number>(
  `${actionNamePrefix}/treeGenerated`,
  async (id) => {
    return await Axios.get(`${baseURL}/tree/${id}`);
  }
);

export const addParent = createAction(
  `${actionNamePrefix}/${PersonNodesPrefix}/parentAdded`,
  (sourceId: number, parent: Person): any => ({
    payload: { source: sourceId, parent },
  })
);
export const addEmptyNode = createAsyncThunk<
  AxiosResponse<CreateNodeResponse>,
  CreateNodeRequestData
>(
  `${actionNamePrefix}/${PersonNodesPrefix}/addNewNode`,
  async (createNodeRequestData): Promise<AxiosResponse<any>> => {
    return await treeAPI.createTreeNode(createNodeRequestData);
  }
);
export const addChild = createAction(
  `${actionNamePrefix}/${PersonNodesPrefix}/childAdded`,
  (parentId: number, child: Person): any => ({
    payload: { parentId, child },
  })
);
export const moveNode = createAction(
  `${actionNamePrefix}/${PersonNodesPrefix}/nodeMoved`,
  (node: Node, x: number, y: number): any => ({
    payload: { node, x, y },
  })
);

export const connectAsChildAsync = (childId: number, parentId: number) => (
  dispatch: any,
  getState: any
) => {
  const state = getState();
  const child = personNodesLocalSelectors.selectById(state.tree.nodes, childId);
  if (!child) {
    throw "Unrecognized child node " + childId;
  }
  const updateNodeData: UpdateNodeRequestData = treeNodeMapper.mapToAPI(child);
  treeAPI
    .updateTreeNode(updateNodeData)
    .then((response) => dispatch(connectAsChild(childId, parentId)));
};

//REDUCER
export const treeReducer = createReducer(treeInitialState, (builder) => {
  builder
    .addCase(deleteNode, (state, action) => {
      const node = action.payload;

      //usun z svg
      //PersonNodesAdapter.removeOne(state.nodes, node.id);
      var links = [
        ...getOutboundLinks(state, node),
        ...getIncomingLinks(state, node),
      ];

      links.forEach((link) => {
        linksAdapter.removeOne(state.links, link.id);
        var targetedFamily = node.id == link.source ? link.target : link.source;

        //TODO stała
        if (targetedFamily != "connecting_node") {
          const family = selectFamily(state.families, targetedFamily);
          if (family) {
            const familyData = family;

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
                ...familyData.children.map((c: EntityId) =>
                  getLinkId(familyData.id, c)
                ),
              ];
              familyNodesAdapter.removeOne(state.families, familyData.id);

              linksAdapter.removeMany(state.links, linksToDelete);
            }
          }
        }
      });
      personNodesAdapter.removeOne(state.nodes, action.payload.id);
    })
    .addCase(setPersonNodes, (state, action) => {
      personNodesAdapter.setAll(state.nodes, action.payload);
    })
    .addCase(deleteFamily, (state, action) => {
      familyNodesAdapter.removeOne(state.families, action.payload);
    })
    .addCase(setFamilyNodes, (state, action) => {
      familyNodesAdapter.setAll(state.families, action.payload);
    })
    .addCase(connectToFamily, (state, action: any) => {
      const { familyId, childId } = action.payload;
      const familyNode = familyNodesLocalSelectors.selectById(
        state.families,
        familyId
      );
      if (!familyNode) {
        throw "Unrecognized family " + familyId;
      }

      const childNode = personNodesLocalSelectors.selectById(
        state.nodes,
        childId
      );
      if (!childNode) {
        throw "Unrecognized child node " + childId;
      }
      familyNode.children.push(childId);

      const parentsIds = [
        familyNode.firstParent,
        familyNode.secondParent,
      ].filter((a) => a) as EntityId[];

      const parents = parentsIds.map((id) =>
        personNodesLocalSelectors.selectById(state.nodes, id)
      ) as PersonNode[];

      parents.forEach((parent) => {
        parent.children.push(childId);
      });

      childNode.firstParent = familyNode.firstParent;
      childNode.secondParent = familyNode.secondParent;
      childNode.families.push(familyId);
      const newLink = createLink(familyNode, childNode);
      linksAdapter.addOne(state.links, newLink);
    })
    .addCase(deleteLink, (state, action) => {
      linksAdapter.removeOne(state.links, action.payload);
    })
    .addCase(setLinks, (state, action) => {
      linksAdapter.setAll(state.links, action.payload);
    })
    .addCase(getTree.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getTree.rejected, (state) => {
      state.isLoading = false;
    })
    .addCase(addEmptyNode.fulfilled, (state, action) => {
      const tree = action.payload.data;
      const nodes = tree.nodes;
      const newNode = nodes.pop();
      if (!newNode) {
        throw "Unrecognized new node ";
      }
      const convertedNewNode = treeNodeMapper.mapToLocal(newNode);
      personNodesAdapter.addOne(state.nodes, convertedNewNode);
    })
    .addCase(connectAsChild, (state, action: any) => {
      const { childId, parentId } = action.payload;
      addFamily(state, randomFamilyId(), parentId, null, [childId]);
    })
    .addCase(addParent, (state, action: any) => {
      const sourceId = action.payload.source as number;
      const parent = action.payload.parent as Person;

      const sourceNode = selectPersonNodeLocal(state.nodes, sourceId);
      if (!sourceNode) {
        return;
      }

      //ma obu rodzicow
      //TODO czy dopuszczac cos takieg? pewnie rzucic blad wyzej
      if (sourceNode.firstParent && sourceNode.secondParent) {
        return;
      }

      var newNode: PersonNode = new PersonNode(
        parent.id,
        //TODO zmienic
        1,
        parent.information,
        sourceNode.location.x + 100,
        sourceNode.location.y + 100,
        [],
        null,
        null,
        [],
        []
      );
      var linksToAdd: Link[];

      if (sourceNode.firstParent || sourceNode.secondParent) {
        //ma juz jednego rodzica -> dodaj do rodziny

        const familyLink = getIncomingLinks(state, sourceNode)[0];
        const familyId = familyLink.source;
        const family = selectFamily(state.families, familyId);
        if (family) {
          if (family.firstParent) {
            family.secondParent = newNode.id;
            sourceNode.secondParent = newNode.id;
            newNode.location.x = sourceNode.location.x + X_SEP;
          } else {
            family.firstParent = newNode.id;
            sourceNode.firstParent = newNode.id;
            newNode.location.x = sourceNode.location.x - X_SEP;
          }
          newNode.location.y = family.location.y - Y_SEP;
          newNode.families.push(family.id);

          linksToAdd = [createLink(newNode, family)];
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
          newNode.id
        );

        newNode.location.x = familyNode.location.x - X_SEP;
        newNode.location.y = familyNode.location.y - Y_SEP;

        linksToAdd = [
          createLink(newNode, familyNode),
          createLink(familyNode, sourceNode),
        ];
        sourceNode.families.push(familyNode.id);
        sourceNode.firstParent = newNode.id;
        familyNodesAdapter.addOne(state.families, familyNode);
        newNode.families.push(familyNode.id);
      }
      newNode.children.push(sourceNode.id);

      linksAdapter.addMany(state.links, linksToAdd);
      personNodesAdapter.addOne(state.nodes, newNode);
    })
    .addCase(getTree.fulfilled, (state, action) => {
      //TODO wyrzucic peopleAdapter
      const peopleArray: Person[] = action.payload.data.nodes.map((n) => {
        const information = treeNodeMapper.getPersonInformation(n);
        var person: Person = {
          treeId: n.treeId,
          children: n.children,
          fatherId: n.fatherId,
          partners: n.partners,
          motherId: n.motherId,
          id: n.nodeId,
          information,
        };

        return person;
      });

      peopleArray.forEach((p) => {
        // p.information.name = names[p.nodeId];
        // p.information.surname = surnames[p.nodeId];
      });

      peopleArray
        .filter((p) => p)
        .forEach((p) => {
          p!.children = [];
          p!.families = [];
          p!.partners = [];
        });

      //Categorize partners and children
      peopleArray.forEach((person: Person) => {
        const { id: id } = person;

        var firstParent: Person | undefined;
        var secondParent: Person | undefined;
        if (person.fatherId) {
          firstParent = peopleArray.find((a) => a.id == person.fatherId);
          if (!firstParent) {
            person.fatherId = null;
          } else {
            firstParent!.children.push(id);
          }
        }

        if (person.motherId) {
          secondParent = peopleArray.find((a) => a.id == person.motherId);
          if (!secondParent) {
            person.motherId = null;
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

      var people = mapCollectionToEntity(peopleArray);

      const trees = GetTreeStructures(people);

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
      var peopleNodes: PersonNode[] = [];
      d3Nodes.forEach((n: any) => {
        var person = selectPersonByIdLocal(people, n.id);
        if (person) {
          const personNode = new PersonNode(
            person.id,
            person.treeId,
            person.information,
            n.x,
            n.y,
            person.children,
            person.fatherId,
            person.motherId,
            n.families
          );
          peopleNodes.push(personNode);
        } else {
          var family = families.find((family) => family.id == n.id);
          if (family) {
            const familyNode = new FamilyNode(
              n.id,
              n.treeId,
              n.x,
              n.y,
              family.children,
              family.firstParent,
              family.secondParent
            );
            familyNodes.push(familyNode);
          } else {
            n.isVisible = false;
          }
        }
      });
      d3Links.forEach((l: any) => {
        l.id = getLinkId(l.source.id, l.target.id);
        l.source = l.source.id;
        l.target = l.target.id;
      });

      familyNodes.forEach((node: FamilyNode) => {
        var familyMembers: EntityId[] = [];
        const familyId = node.id;
        if (node.firstParent) {
          familyMembers.push(node.firstParent);
        }
        if (node.secondParent) {
          familyMembers.push(node.secondParent);
        }
        familyMembers = [...node.children, ...familyMembers];

        familyMembers.forEach((memberId) => {
          const memberNode = peopleNodes.find((n) => n.id == memberId);
          if (memberNode && !memberNode.families.includes(familyId)) {
            memberNode.families.push(familyId);
          }
        });
      });

      state.isLoading = false;
      linksAdapter.setAll(state.links, d3Links);
      personNodesAdapter.setAll(state.nodes, peopleNodes);
      familyNodesAdapter.setAll(state.families, familyNodes);

      const { treeId } = action.payload.data;
      state.treeId = treeId;
    })
    .addCase(moveNode, (state, action: any) => {
      var { node, x, y } = action.payload;
      var nodeToMove = node.isFamily
        ? selectFamily(state.families, node.id)
        : selectPersonNodeLocal(state.nodes, node.id);

      if (nodeToMove) {
        nodeToMove.location = { x, y };
      }
    })
    .addCase(addChild, (state, action: any) => {
      const { parentId, child } = action.payload;
    });
});

const createLink = (source: Node, target: Node): Link => {
  var linkId = getLinkId(source.id, target.id);
  const link: Link = {
    id: linkId,
    source: source.id,
    target: target.id,
  };

  return link;
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

export const getLinkNodes = (state: TreeState, link: Link) => {
  return {
    sourceNode: getNodeById(state, link.source),
    targetNode: getNodeById(state, link.target),
  };
};

export interface Point {
  x: number;
  y: number;
}
function isInt(value: any) {
  var x = parseFloat(value);
  return !isNaN(value) && (x | 0) === x;
}
export const familyIdGenerator = (
  state: TreeState,
  graphNumber: number
): string => {
  const id = `${graphNumber}u${state.nextFamilyId}`;
  state.nextFamilyId++;
  return id;
};

export const getOutboundLinks = (state: TreeState, node: Node): Link[] => {
  var links: Link[] = [];
  if (node instanceof PersonNode) {
    //szukamy rodziny gdzie jest rodzicem
    const families = node.families
      .map((family) => selectFamily(state.families, family))
      .filter((f) => f) as FamilyNode[];

    const childFamilies = families.filter(
      (family) =>
        family.firstParent == node.id || family.secondParent == node.id
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

  if (node instanceof PersonNode) {
    //szukamy rodziny gdzie jest dzieckiem
    const families = node.families
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
    if (node.firstParent) {
      var id = getLinkId(node.firstParent, node.id);
      var link = selectLinkLocal(state.links, id);
      if (link) {
        links.push(link);
      }
    }
    if (node.secondParent) {
      var link = selectLinkLocal(
        state.links,
        getLinkId(node.secondParent, node.id)
      );
      if (link) {
        links.push(link);
      }
    }
    return links;
  }
  return [];
};
// TODO OUTGOING LINKS
export const getNodeLinks = (state: TreeState, node: Node): Link[] => {
  return [...getIncomingLinks(state, node), ...getOutboundLinks(state, node)];
};

const addFamily = (
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

export const randomFamilyId = () => {
  // TODO generator id rodziny
  return `100u${Math.floor(Math.random() * 100000 + 1000)}`;
};
