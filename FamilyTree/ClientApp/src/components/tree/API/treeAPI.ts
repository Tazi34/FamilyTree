import { requestExportTree } from "./exportTree/requestExportTree";
import { hideBranchRequest } from "./hideBranch/hideBranchRequest";
import { connectPartnersRequest } from "./connectNodes/connectPartnerRequest";
import { connectNodesRequest } from "./connectNodes/connectNodesRequest";
import { changeTreeNameRequest } from "./changeTreeName/changeTreeNameRequest";
import { changeTreeVisibilityRequest } from "./changeVisibility/changeTreeVisibilityRequest";
import { uploadTreeNodePicture } from "./uploadPicture/uploadTreeNodePicture";
import { moveTreeNode } from "./moveNode/moveNodeRequest";
import { updateTreeNode } from "./updateNode/updateNodeRequest";
import { createTreeNode } from "./createNode/createNodeRequest";
import { deleteTreeNode } from "./deleteNode/deleteNodeRequest";
import { disconnectNodeRequest } from "./disconnectNode/disconnectNode";
export const treeAPI = {
  createTreeNode,
  updateTreeNode,
  deleteTreeNode,
  moveTreeNode,
  uploadTreeNodePicture,
  changeTreeVisibilityRequest,
  changeTreeNameRequest,
  connectNodesRequest,
  connectPartnersRequest,
  hideBranchRequest,
  disconnectNodeRequest,
  requestExportTree,
};
