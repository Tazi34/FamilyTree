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
import { X_SEP, Y_SEP } from "../../../d3/RectMapper";
import { GetTreeStructures } from "../../../d3/treeStructureGenerator";
import { baseURL } from "../../../helpers/apiHelpers";
import {
  createActionWithPayload,
  mapCollectionToEntity,
} from "../../../helpers/helpers";
import { ApplicationState } from "../../../helpers/index";
import { Family, Person } from "../../../model/TreeStructureInterfaces";
import { selectSelf } from "../../loginPage/authenticationReducer";
import {
  CreateNodeRequestData,
  CreateNodeResponse,
} from "../API/createNode/createNodeRequest";
import { GetTreeResponse } from "../API/getTree/getTreeRequest";
import { treeAPI } from "../API/treeAPI";
import { treeNodeMapper } from "../API/utils/NodeMapper";
import { getLinkId } from "../helpers/idHelpers";
import { FamilyNode } from "../model/FamilyNode";
import { Node } from "../model/NodeClass";
import { PersonNode } from "../model/PersonNode";
import { Point } from "../Point";
import { Link } from "../model/Link";
import { addFamily, connectAsChild } from "./updateNodes/connectAsChild";
import {
  createLink,
  getIncomingLinks,
  getOutboundLinks,
  randomFamilyId,
} from "./utils/getOutboundLinks";
import { connectToFamily } from "./updateNodes/connectToFamily";
import { deleteLink } from "./updateLinks/deleteLink";
import {
  DeleteNodeRequestData,
  DeleteNodeResponse,
} from "../API/deleteNode/deleteNodeRequest";
import { addParent, addParentReducerHandler } from "./updateNodes/addParent";
import { removeNodeFromTree } from "./updateNodes/deleteNode";

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
export const treeActionsPrefix = "tree";
export const personNodesActionsPrefix = "nodes";
export const familyNodesActionsPrefix = "families";
export const linksActionsPrefix = "links";

export const changeNodePosition = createAction(
  `${treeActionsPrefix}/nodeMoved`,
  (nodeId: number, location: Point): any => ({
    payload: { nodeId, location },
  })
);

export const setPersonNodes = createActionWithPayload<PersonNode[]>(
  `${treeActionsPrefix}/${personNodesActionsPrefix}/nodesSet`
);

export const setLinks = createActionWithPayload<Link[]>(
  `${treeActionsPrefix}/${linksActionsPrefix}/linksSet`
);

export const deleteFamily = createActionWithPayload<string>(
  `${treeActionsPrefix}/${familyNodesActionsPrefix}/familyDeleted`
);
export const setFamilyNodes = createActionWithPayload<FamilyNode[]>(
  `${treeActionsPrefix}/${familyNodesActionsPrefix}/familiesSet`
);

export const getTree = createAsyncThunk<AxiosResponse<GetTreeResponse>, number>(
  `${treeActionsPrefix}/treeGenerated`,
  async (id) => {
    return await Axios.get(`${baseURL}/tree/${id}`);
  }
);

export const addNode = createAsyncThunk<
  AxiosResponse<CreateNodeResponse>,
  CreateNodeRequestData
>(
  `${treeActionsPrefix}/${personNodesActionsPrefix}/addNewNode`,
  async (createNodeRequestData): Promise<AxiosResponse<any>> => {
    return await treeAPI.createTreeNode(createNodeRequestData);
  }
);
export const addChild = createAction(
  `${treeActionsPrefix}/${personNodesActionsPrefix}/childAdded`,
  (parentId: number, child: Person): any => ({
    payload: { parentId, child },
  })
);
export const moveNode = createAction(
  `${treeActionsPrefix}/${personNodesActionsPrefix}/nodeMoved`,
  (node: Node, x: number, y: number): any => ({
    payload: { node, x, y },
  })
);

//REDUCER
export const treeReducer = createReducer(treeInitialState, (builder) => {
  builder
    .addCase(removeNodeFromTree, (state, action) => {
      const nodeId = action.payload;
      const node = selectPersonNodeLocal(state.nodes, nodeId);
      if (!node) {
        throw "Unrecognized node. Cant delete";
      }

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
            if (familyData.fatherId == id) {
              familyData.fatherId = null;
            } else if (familyData.motherId == id) {
              familyData.motherId = null;
            } else {
              familyData.children = familyData.children.filter(
                (a: any) => a != id
              );
            }
            if (
              (!familyData.fatherId && !familyData.motherId) ||
              familyData.children.length == 0
            ) {
              var linksToDelete = [
                getLinkId(node.id, familyData.id),
                getLinkId(familyData.fatherId, familyData.id),
                getLinkId(familyData.motherId, familyData.id),
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
      personNodesAdapter.removeOne(state.nodes, action.payload);
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

      const parentsIds = [familyNode.fatherId, familyNode.motherId].filter(
        (a) => a
      ) as EntityId[];

      const parents = parentsIds.map((id) =>
        personNodesLocalSelectors.selectById(state.nodes, id)
      ) as PersonNode[];

      parents.forEach((parent) => {
        parent.children.push(childId);
      });

      childNode.fatherId = familyNode.fatherId;
      childNode.motherId = familyNode.motherId;
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
    .addCase(addNode.fulfilled, (state, action) => {
      const newNode = action.payload.data;
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
    .addCase(addParent, addParentReducerHandler)
    .addCase(getTree.fulfilled, (state, action) => {
      const nodes: PersonNode[] = action.payload.data.nodes.map((node) =>
        treeNodeMapper.mapToLocal(node)
      );

      var nodesNormalized = mapCollectionToEntity(nodes);

      const trees = GetTreeStructures(nodesNormalized);

      var roots: any = [];
      var links: string[][] = [];
      var families: FamilyNode[] = [];

      var connectingNode = {
        id: "connecting_node",
      };

      trees.forEach((tree) => {
        if (tree.people.ids.length == 0) {
          return;
        }
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

        const newRoots = nodes.filter((a: any) => a.layer == 0);
        links = [...links, ...tree.links];
        const treeRoot = {
          id:
            "connecting_subtree_root_" +
            selectAllPersonNodesLocal(tree.people)[0].graph,
        };
        console.log(newRoots);

        newRoots.forEach((root: any) => {
          links.push([treeRoot.id, root.id]);
        });
        links.push([connectingNode.id, treeRoot.id]);
        families = [...families, ...tree.families];
      });
      console.log(links);

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

      d3Nodes.forEach((d3Node: any) => {
        setNodeLocation(nodesNormalized, d3Node, families);
      });
      d3Links.forEach((l: any) => {
        setLinkEnds(l);
      });

      families.forEach((node: FamilyNode) => {
        var familyMembers: EntityId[] = [];
        const familyId = node.id;
        if (node.fatherId) {
          familyMembers.push(node.fatherId);
        }
        if (node.motherId) {
          familyMembers.push(node.motherId);
        }
        familyMembers = [...node.children, ...familyMembers];

        familyMembers.forEach((memberId) => {
          const memberNode = nodes.find((n) => n.id == memberId);
          if (memberNode && !memberNode.families.includes(familyId)) {
            memberNode.families.push(familyId);
          }
        });
      });

      state.isLoading = false;
      linksAdapter.setAll(state.links, d3Links);
      personNodesAdapter.setAll(state.nodes, nodes);
      familyNodesAdapter.setAll(state.families, families);

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
function setLinkEnds(l: any) {
  l.id = getLinkId(l.source.id, l.target.id);
  l.source = l.source.id;
  l.target = l.target.id;
}

function setNodeLocation(
  nodesNormalized: EntityState<PersonNode>,
  d3Node: any,
  families: FamilyNode[]
) {
  var person = selectPersonNodeLocal(nodesNormalized, d3Node.id);
  if (person) {
    person.location = {
      x: d3Node.x,
      y: d3Node.y,
    };
  } else {
    var family = families.find((family) => family.id == d3Node.id);
    if (family) {
      family.location = {
        x: d3Node.x,
        y: d3Node.y,
      };
    } else {
      d3Node.isVisible = false;
    }
  }
}
