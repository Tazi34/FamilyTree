import {
  createAction,
  createAsyncThunk,
  createDraftSafeSelector,
  createEntityAdapter,
  createReducer,
  EntityId,
  EntityState,
  Update,
} from "@reduxjs/toolkit";
import Axios, { AxiosResponse } from "axios";
import { GetTreeStructures } from "../../../d3/treeStructureGenerator";
import { baseURL } from "../../../helpers/apiHelpers";
import {
  createActionWithPayload,
  mapCollectionToEntity,
} from "../../../helpers/helpers";
import { ApplicationState } from "../../../helpers/index";
import { Person } from "../../../model/TreeStructureInterfaces";
import { selectSelf } from "../../loginPage/authenticationReducer";
import {
  CreateNodeRequestData,
  CreateNodeResponse,
} from "../API/createNode/createNodeRequest";
import { GetTreeResponse } from "../API/getTree/getTreeRequest";
import { treeAPI } from "../API/treeAPI";
import { treeNodeMapper } from "../API/utils/NodeMapper";
import { TreeAPI } from "../API/utils/TreeModel";
import { getLinkId } from "../helpers/idHelpers";
import { FamilyNode, getFamilyLocation } from "../model/FamilyNode";
import { Link } from "../model/Link";
import { Node } from "../model/NodeClass";
import { PersonNode } from "../model/PersonNode";
import { Point } from "../Point";
import { TreeInformation } from "./../../../model/TreeInformation";
import {
  ChangeTreeNameRequestData,
  ChangeTreeNameResponse,
} from "./../API/changeTreeName/changeTreeNameRequest";
import { ChangeTreeVisibilityResponse } from "./../API/changeVisibility/changeTreeVisibilityRequest";
import { LinkLoaded } from "./../LinkComponent";
import { deleteLink } from "./updateLinks/deleteLink";
import { addParent, addParentReducerHandler } from "./updateNodes/addParent";
import { connectToFamily } from "./updateNodes/connectToFamily";
import { deleteNode, removeNodeFromTree } from "./updateNodes/deleteNode";
import { moveNode, moveNodeThunk } from "./updateNodes/moveNode";
import { uploadTreeNodePictureRequest } from "./updateNodes/setNodePicture";
import {
  createLink,
  getIncomingLinks,
  getNodeById,
  getOutboundLinks,
  randomFamilyId,
} from "./utils/getOutboundLinks";

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
  treeInformation: TreeInformation | null;
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
  treeInformation: null,
};
export const connectAsChild = createAction(
  `tree/parentConnected`,
  (childId: EntityId, parentId: EntityId): any => ({
    payload: { childId, parentId },
  })
);
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
export const changeTreeName = createAsyncThunk<
  AxiosResponse<ChangeTreeNameResponse>,
  ChangeTreeNameRequestData
>(`userTrees/changeTreeName`, async (requestData) => {
  return await treeAPI.changeTreeNameRequest(requestData);
});
export const getTree = createAsyncThunk<AxiosResponse<GetTreeResponse>, number>(
  `${treeActionsPrefix}/treeGenerated`,
  async (id) => {
    return await Axios.get(`${baseURL}/tree/${id}`);
  }
);
export const setTree = createAction(
  `${treeActionsPrefix}/treeCreated`,
  (tree: TreeAPI): any => ({
    payload: { tree },
  })
);

export const addEmptyNode = (data: CreateNodeRequestData) => (
  dispatch: any
) => {
  return dispatch(addNode(data)).then((resp: any) => {
    if (resp.type === addNode.fulfilled.toString()) {
      return dispatch(setTree(resp.payload.data));
    }
    return resp;
  });
};

export const addNode = createAsyncThunk<
  AxiosResponse<CreateNodeResponse>,
  CreateNodeRequestData
>(
  `${treeActionsPrefix}/${personNodesActionsPrefix}/addNewNode`,
  async (createNodeRequestData): Promise<AxiosResponse<any>> => {
    createNodeRequestData.birthday = new Date(
      createNodeRequestData.birthday
    ).toISOString();

    return await treeAPI.createTreeNode(createNodeRequestData);
  }
);
export const addChild = createAction(
  `${treeActionsPrefix}/${personNodesActionsPrefix}/childAdded`,
  (parentId: number, child: Person): any => ({
    payload: { parentId, child },
  })
);
export const changeTreeVisibility = createAsyncThunk<
  AxiosResponse<ChangeTreeVisibilityResponse>,
  TreeInformation
>(`userTrees/changeVisibility`, async (treeInformation: TreeInformation) => {
  const modifiedTreeData: TreeInformation = {
    ...treeInformation,
    isPrivate: !treeInformation.isPrivate,
  };
  return await treeAPI.changeTreeVisibilityRequest(modifiedTreeData);
});

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

        const family = selectFamily(state.families, targetedFamily);
        if (family) {
          const familyData = family;

          const id = node.id;
          let otherNodeId: EntityId | null = null;
          let shouldDeleteFamily: boolean = false;
          let isChild: boolean = false;

          if (familyData.fatherId == id) {
            otherNodeId = familyData.motherId;
          } else if (familyData.motherId == id) {
            otherNodeId = familyData.fatherId;
          } else {
            isChild = true;
          }

          if (isChild) {
            if (familyData.children.length === 1) {
              shouldDeleteFamily = true;
            }
          } else {
            if (otherNodeId === null) {
              shouldDeleteFamily = true;
            }
          }

          if (shouldDeleteFamily) {
            var linksToDelete = getOutboundLinks(state, family);
            familyNodesAdapter.removeOne(state.families, familyData.id);
            linksAdapter.removeMany(
              state.links,
              linksToDelete.map((link) => link.id)
            );
            console.log(linksToDelete);
          } else {
            const children = family.children.filter((f) => f !== node.id);
            //przelacz rodzine na jednego usera - trzeba usunac linki
            if (otherNodeId) {
              const otherNode = selectPersonNodeLocal(state.nodes, otherNodeId);
              const newLocation = getFamilyLocation(otherNode as PersonNode);

              familyNodesAdapter.updateOne(state.families, {
                id: family.id,
                changes: {
                  x: newLocation.x,
                  y: newLocation.y,
                  fatherId:
                    familyData.fatherId === node.id ? null : otherNodeId,
                  motherId:
                    familyData.motherId === node.id ? null : otherNodeId,
                  children: children,
                },
              });

              const linkToDelete = getLinkId(otherNodeId, family.id);
              console.log(linkToDelete);
              linksAdapter.removeOne(state.links, linkToDelete);
            } else {
              familyNodesAdapter.updateOne(state.families, {
                id: family.id,
                changes: {
                  children: children,
                },
              });
            }
          }
        }
      });
      personNodesAdapter.removeOne(state.nodes, action.payload);
    })
    .addCase(uploadTreeNodePictureRequest.fulfilled, (state, action) => {
      const nodeId = action.meta.arg.nodeId;
      const node = selectPersonNodeLocal(state.nodes, nodeId) as PersonNode;

      const update: Update<PersonNode> = {
        id: nodeId,
        changes: {
          personDetails: {
            ...node.personDetails,
            pictureUrl: action.payload.data.pictureUrl,
          },
        },
      };
      personNodesAdapter.updateOne(state.nodes, update);
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
      //  childNode.families.push(familyId);
      const newLink = createLink(familyNode, childNode);
      linksAdapter.addOne(state.links, newLink);
    })
    .addCase(changeTreeVisibility.fulfilled, (state, action) => {
      const response = action.payload.data;
      state.treeInformation = {
        canEdit: response.canEdit,
        isPrivate: response.isPrivate,
        name: response.name,
        treeId: response.treeId,
      };
    })
    .addCase(changeTreeName.fulfilled, (state, action) => {
      const response = action.payload.data;
      state.treeInformation = {
        canEdit: response.canEdit,
        isPrivate: response.isPrivate,
        name: response.name,
        treeId: response.treeId,
      };
    })
    .addCase(setTree, (state, action: any) => {
      const tree: TreeAPI = action.payload.tree;
      createTree(tree, state);
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

    .addCase(addParent, addParentReducerHandler)
    .addCase(getTree.fulfilled, (state, action) => {
      const treeData = action.payload.data;
      createTree(treeData, state);
    })
    .addCase(moveNode, (state, action: any) => {
      var node = action.payload.node;
      var x = action.payload.x;
      var y = action.payload.y;
      var nodeToMove = selectPersonNodeLocal(state.nodes, node.id);

      if (nodeToMove) {
        const nodeFamilies = selectAllFamiliesLocal(state.families).filter(
          (family) => family.fatherId === node.id || family.motherId === node.id
        );

        nodeFamilies.forEach((family) => {
          var familyLocation: Point;

          if (family.fatherId && family.motherId) {
            const nodeToLoadId =
              family.fatherId === node.id ? family.motherId : family.fatherId;
            const otherNode = selectPersonNodeLocal(state.nodes, nodeToLoadId);
            familyLocation = getFamilyLocation({ x: x, y: y }, otherNode);
          } else {
            familyLocation = getFamilyLocation({ x, y });
          }
          const update: Update<FamilyNode> = {
            id: family.id,
            changes: { x: familyLocation.x, y: familyLocation.y },
          };
          familyNodesAdapter.updateOne(state.families, update);
        });
        personNodesAdapter.updateOne(state.nodes, {
          id: nodeToMove.id,
          changes: {
            x,
            y,
          },
        });
      }

      // if (nodeToMove) {
      //   const update: Update<PersonNode> = {
      //     id: nodeToMove.id,
      //     changes: { x, y },
      //   };
      //   personNodesAdapter.updateOne(state.nodes, update);
      //   // personNodesAdapter.removeOne(state.nodes, nodeToMove.id);
      //   // personNodesAdapter.addOne(state.nodes, { ...nodeToMove, x, y });
      // }
    })
    .addCase(moveNodeThunk.fulfilled, (state, action) => {
      const movedNode = action.payload.data;
      var node = state.nodes.entities[movedNode.nodeId];
      if (node) {
        node.x = movedNode.x;
        node.y = movedNode.y;
      }
    })
    .addCase(addChild, (state, action: any) => {});
});
function createTree(tree: TreeAPI, state: TreeState) {
  linksAdapter.setAll(state.links, tree.links);

  var familyNodes = tree.families.map(
    (familyAPI) =>
      new FamilyNode(
        familyAPI.id,
        tree.treeId,
        familyAPI.x,
        familyAPI.y,
        familyAPI.children,
        familyAPI.firstParentId,
        familyAPI.secondParentId
      )
  );
  const nodes: PersonNode[] = tree.nodes.map((node) =>
    treeNodeMapper.mapToLocal(node)
  );

  familyNodesAdapter.setAll(state.families, familyNodes);
  personNodesAdapter.setAll(state.nodes, nodes);

  const treeInformation: TreeInformation = {
    canEdit: tree.canEdit,
    isPrivate: tree.isPrivate,
    name: tree.name,
    treeId: tree.treeId,
  };
  state.treeId = tree.treeId;
  state.isLoading = false;
  state.treeInformation = treeInformation;

  // var nodesNormalized = mapCollectionToEntity(nodes);

  // const trees = GetTreeStructures(nodesNormalized);

  // var links: string[][] = [];
  // var families: FamilyNode[] = [];

  // trees.forEach((tree) => {
  //   links = [...links, ...tree.links];
  //   families = [...families, ...tree.families];
  // });

  // var linksEntities: Link[] = links.map((link) => ({
  //   source: link[0],
  //   target: link[1],
  //   id: getLinkId(link[0], link[1]),
  // }));

  // families.forEach((node: FamilyNode) => {
  //   var familyMembers: EntityId[] = [];
  //   const familyId = node.id;
  //   if (node.fatherId) {
  //     familyMembers.push(node.fatherId);
  //   }
  //   if (node.motherId) {
  //     familyMembers.push(node.motherId);
  //   }
  //   familyMembers = [...node.children, ...familyMembers];

  //   familyMembers.forEach((memberId) => {
  //     const memberNode = nodes.find((n) => n.id == memberId);
  //     if (memberNode && !memberNode.families.includes(familyId)) {
  //     //  memberNode.families.push(familyId);
  //     }
  //   });
  // });

  // families.forEach((family) => {
  //   let mother: PersonNode | undefined = undefined;
  //   let father: PersonNode | undefined = undefined;

  //   if (family.motherId) {
  //     mother = nodes.find((n) => n.id == family.motherId);
  //   }
  //   if (family.fatherId) {
  //     father = nodes.find((n) => n.id == family.fatherId);
  //   }
  //   if (mother && father) {
  //     family.x =
  //       Math.min(mother.x, father.x) + Math.abs(mother.x - father.x) / 2;
  //     family.y =
  //       Math.min(mother.y, father.y) + Math.abs(mother.y - father.y) / 2;
  //   } else {
  //     const existingMember = father ?? mother;
  //     if (!existingMember) {
  //       //TODO co jak nie ma? exception?
  //     } else {
  //       family.x = existingMember.x;
  //       family.y = existingMember.y;
  //     }
  //   }
  // });

  // families.forEach((family) => {
  //   let familyId = `f${family.fatherId ?? ""}${family.motherId ?? ""}`;
  //   const childrenIds = family.children.map((child) => child as number).sort();

  //   childrenIds.forEach((id) => {
  //     familyId += id;
  //   });
  //   family.id = familyId;
  // });

  // linksAdapter.setAll(state.links, linksEntities);
  // personNodesAdapter.setAll(state.nodes, nodes);
  // familyNodesAdapter.setAll(state.families, families);
  //
}

export const linkLoader = (state: TreeState, link: Link): LinkLoaded | null => {
  const source = getNodeById(state, link.source);
  const target = getNodeById(state, link.target);
  if (!source || !target) {
    return null;
  }
  return {
    source,
    target,
    linkId: link.id,
  };
};
