import { useThunkDispatch } from "../..";
import { CreateNodeFormData } from "../addNodeActionDialog/CreateTreeNodeDialog";
import { ConnectNodesRequestData } from "./API/connectNodes/connectNodesRequest";
import { ConnectPartnersRequestData } from "./API/connectNodes/connectPartnerRequest";
import { CreateNodeRequestData } from "./API/createNode/createNodeRequest";
import { FamilyNode } from "../../model/FamilyNode";
import { addEmptyNode } from "./reducer/treeReducer";
import { connectNodes } from "./reducer/updateNodes/connectChildWithNodes";
import { connectPartners } from "./reducer/updateNodes/connectPartners";
import { requestDeleteNode } from "./reducer/updateNodes/deleteNode";
import { requestDisconnectNode } from "./reducer/updateNodes/disconnectNodes";
import { hideBranch } from "./reducer/updateNodes/hideBranch";
import { PersonNode } from "../../model/PersonNode";
import { changeNodeVisibility } from "./reducer/updateNodes/changeNodeVisibility";

type TreeActions = {
  onNodeDisconnect: (node: PersonNode) => any;
  onBranchHide: (family: FamilyNode) => any;
  onAsChildConnect: (
    treeId: number,
    childNode: number,
    parentNode: number,
    secondParentNode?: number
  ) => any;
  onAsPartnerConnect: (firstPartner: number, secondPartner: number) => any;
  onNodeAdd: (
    treeId: number,
    x: number,
    y: number,
    formData: CreateNodeFormData
  ) => any;
  onDefaultNodeAdd: (treeId: number, x: number, y: number) => any;
  onNodeDelete: (id: number) => void;
  onNodeVisibilityChange: (id: number) => void;
};

const useTreeActions = (): TreeActions => {
  const dispatch = useThunkDispatch();

  const onNodeDelete = (id: number) => {
    dispatch(requestDeleteNode(id));
  };

  const onNodeDisconnect = (node: PersonNode) => {
    return dispatch(requestDisconnectNode([node.id as number]));
  };
  const onAsChildConnect = (
    treeId: number,
    childNode: number,
    parentNode: number,
    secondParentNode?: number
  ) => {
    const data: ConnectNodesRequestData = {
      treeId,
      childId: childNode,
      firstParentId: parentNode,
      secondParentId: secondParentNode,
    };
    return dispatch(connectNodes(data));
  };

  const onAsPartnerConnect = (firstPartner: number, secondPartner: number) => {
    const data: ConnectPartnersRequestData = {
      firstPartnerId: firstPartner,
      secondPartnerId: secondPartner,
    };
    return dispatch(connectPartners(data));
  };
  const onBranchHide = (family: FamilyNode) => {
    return dispatch(
      hideBranch({
        familyId: family.id as string,
        show: family.hidden,
        treeId: family.treeId,
      })
    );
  };
  const onNodeAdd = (
    treeId: number,
    x: number,
    y: number,
    formData: CreateNodeFormData
  ) => {
    var createNodeData: CreateNodeRequestData = {
      ...formData,
      userId: 0,
      fatherId: 0,
      motherId: 0,
      children: [],
      partners: [],
      x: x,
      y: y,
      picture: formData.picture,
      treeId,
    };
    return dispatch(addEmptyNode(createNodeData));
  };

  const onDefaultNodeAdd = (treeId: number, x: number, y: number) => {
    const createNodeData: CreateNodeRequestData = {
      userId: 0,
      treeId,
      children: [],
      fatherId: 0,
      motherId: 0,
      picture: "",
      description: "Very fascinating description :0",
      name: "Adam",
      sex: "Male",
      x,
      y,
      surname: "Kowalski",
      birthday: "2020-12-16T20:29:42.677Z",
      partners: [],
    };
    return dispatch(addEmptyNode(createNodeData));
  };

  const onNodeVisibilityChange = (id: number) => {
    dispatch(changeNodeVisibility(id));
  };
  return {
    onBranchHide,
    onAsPartnerConnect,
    onAsChildConnect,
    onNodeDisconnect,
    onNodeAdd,
    onDefaultNodeAdd,
    onNodeDelete,
    onNodeVisibilityChange,
  };
};
export default useTreeActions;
