import { connectNodesRequest } from "./connectNodes/connectNodesRequest";
import { changeTreeNameRequest } from "./changeTreeName/changeTreeNameRequest";
import { changeTreeVisibilityRequest } from "./changeVisibility/changeTreeVisibilityRequest";
import { uploadTreeNodePicture } from "./uploadPicture/uploadTreeNodePicture";
import { addSiblingTreeNode } from "./addSibling/addSiblingRequest";
import { moveTreeNode } from "./moveNode/moveNodeRequest";
import { updateTreeNode } from "./updateNode/updateNodeRequest";
import { createTreeNode } from "./createNode/createNodeRequest";
import { deleteTreeNode } from "./deleteNode/deleteNodeRequest";
export const treeAPI = {
  createTreeNode,
  updateTreeNode,
  deleteTreeNode,
  moveTreeNode,
  addSiblingTreeNode,
  uploadTreeNodePicture,
  changeTreeVisibilityRequest,
  changeTreeNameRequest,
  connectNodesRequest,
};
