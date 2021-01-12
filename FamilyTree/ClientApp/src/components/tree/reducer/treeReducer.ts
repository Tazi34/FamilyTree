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
import { transformCanvas } from "../../canvas/reducer/canvasReducer";
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
import { FamilyNode, getFamilyLocation } from "../../../model/FamilyNode";
import { Link } from "../../../model/Link";
import { Node } from "../../../model/NodeClass";
import { Point } from "../../../model/Point";
import { TreeInformation } from "./../../../model/TreeInformation";
import {
  ChangeTreeNameRequestData,
  ChangeTreeNameResponse,
} from "./../API/changeTreeName/changeTreeNameRequest";
import { ChangeTreeVisibilityResponse } from "./../API/changeVisibility/changeTreeVisibilityRequest";
import { ExportTreeRequestData } from "./../API/exportTree/requestExportTree";
import { LinkLoaded } from "../../link/LinkComponent";
import { changeNodeVisibility } from "./updateNodes/changeNodeVisibility";
import { moveNode, moveNodeThunk } from "./updateNodes/moveNode";
import { uploadTreeNodePictureRequest } from "./updateNodes/setNodePicture";
import { getNodeById } from "./utils/getOutboundLinks";
import { PersonNode } from "../../../model/PersonNode";

//TYPES
export type TreeState = {
  nodes: EntityState<PersonNode>;
  links: EntityState<Link>;
  families: EntityState<FamilyNode>;
  isLoading: boolean;
  nextFamilyId: number;
  treeId: number | null;
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
  selectById: selectPersonNode,
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

export const getTree = (treeId: number) => (dispatch: any) => {
  return dispatch(fetchTree(treeId)).then((resp: any) => {
    if (resp.type === fetchTree.fulfilled.toString()) {
      return dispatch(setAndCenterTree(resp.payload.data));
    }
    return resp;
  });
};
export const setAndCenterTree = (tree: TreeAPI) => (
  dispatch: any,
  getState: any
) => {
  const state: ApplicationState = getState();
  const canvas = state.canvas;

  //wycentruj drzewo
  const nodes = tree.nodes;
  const margin = 400;
  const maxX = Math.max(...nodes.map((n) => n.x)) + margin;
  const maxY = Math.max(...nodes.map((n) => n.y)) + margin;
  const minX = Math.min(...nodes.map((n) => n.x)) - margin;
  const minY = Math.min(...nodes.map((n) => n.y)) - margin;
  const width = maxX - minX;
  const height = maxY - minY;

  const widthScale = canvas.width / width;
  const heightScale = canvas.height / height;

  let scale = Math.min(widthScale, heightScale);
  scale = scale < 1 ? scale : 1;
  const transformState = {
    x: -scale * (minX + width / 2) + canvas.width / 2,
    y: -scale * (minY + height / 2) + canvas.height / 2,
    scale: scale,
  };
  dispatch(transformCanvas(transformState));

  return dispatch(setTree(tree));
};

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
