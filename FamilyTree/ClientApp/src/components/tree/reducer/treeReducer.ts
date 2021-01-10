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
import { baseURL } from "../../../helpers/apiHelpers";
import { ApplicationState } from "../../../helpers/index";
import { selectSelf } from "../../loginPage/authenticationReducer";
import {
  CreateNodeRequestData,
  CreateNodeResponse,
} from "../API/createNode/createNodeRequest";
import { ExportTreeResponse } from "../API/exportTree/requestExportTree";
import { GetTreeResponse } from "../API/getTree/getTreeRequest";
import { treeAPI } from "../API/treeAPI";
import { treeNodeMapper } from "../API/utils/NodeMapper";
import { TreeAPI } from "../API/utils/TreeModel";
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
import { ExportTreeRequestData } from "./../API/exportTree/requestExportTree";
import { LinkLoaded } from "./../LinkComponent";
import { changeNodeVisibility } from "./updateNodes/changeNodeVisibility";
import { moveNode, moveNodeThunk } from "./updateNodes/moveNode";
import { uploadTreeNodePictureRequest } from "./updateNodes/setNodePicture";
import { getNodeById } from "./utils/getOutboundLinks";

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

export const changeTreeName = createAsyncThunk<
  AxiosResponse<ChangeTreeNameResponse>,
  ChangeTreeNameRequestData
>(`userTrees/changeTreeName`, async (requestData) => {
  return await treeAPI.changeTreeNameRequest(requestData);
});
export const fetchTree = createAsyncThunk<
  AxiosResponse<GetTreeResponse>,
  number
>(`${treeActionsPrefix}/treeFetched`, async (id) => {
  return await Axios.get(`${baseURL}/tree/${id}`);
});
export const setTree = createAction(
  `${treeActionsPrefix}/treeSet`,
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
    createNodeRequestData.x = Math.floor(createNodeRequestData.x);
    createNodeRequestData.y = Math.floor(createNodeRequestData.y);

    return await treeAPI.createTreeNode(createNodeRequestData);
  }
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

export const exportTree = createAsyncThunk<
  AxiosResponse<ExportTreeResponse>,
  ExportTreeRequestData
>(`tree/export`, async (data) => {
  return await treeAPI.requestExportTree(data);
});

//REDUCER
export const treeReducer = createReducer(treeInitialState, (builder) => {
  builder
    .addCase(changeNodeVisibility, (state, action) => {
      const node = selectPersonNodeLocal(state.nodes, action.payload);
      const update: Update<PersonNode> = {
        id: action.payload,
        changes: {
          hidden: !node?.hidden,
        },
      };
      personNodesAdapter.updateOne(state.nodes, update);
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
    .addCase(fetchTree.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(fetchTree.rejected, (state) => {
      state.isLoading = false;
    })
    .addCase(fetchTree.fulfilled, (state, action) => {
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
            familyLocation = getFamilyLocation(
              family,
              { x: x, y: y },
              otherNode
            );
          } else {
            familyLocation = getFamilyLocation(family, { x, y });
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
    })
    .addCase(moveNodeThunk.fulfilled, (state, action) => {
      const movedNode = action.payload.data;
      var node = state.nodes.entities[movedNode.nodeId];
      if (node) {
        node.x = movedNode.x;
        node.y = movedNode.y;
      }
    });
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
        familyAPI.secondParentId,
        familyAPI.hidden
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
