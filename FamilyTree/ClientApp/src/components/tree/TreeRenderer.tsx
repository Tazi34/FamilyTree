import { Fade } from "@material-ui/core";
import { EntityId } from "@reduxjs/toolkit";
import Axios from "axios";
import React from "react";
import { useSelector } from "react-redux";
import { useThunkDispatch } from "../..";
import { ApplicationState } from "../../helpers";
import { baseURL } from "../../helpers/apiHelpers";
import { CreateNodeRequestData } from "./API/createNode/createNodeRequest";
import Families from "./Families";
import FollowableLink from "../link/FollowableLink";
import { LinkLoaded } from "../link/LinkComponent";
import Links from "../link/Links";
import moveNodeOnCanvas from "./logic/moveNodeOnCanvas";
import { FamilyNode } from "../../model/FamilyNode";
import { Link } from "../../model/Link";
import { Node } from "../../model/NodeClass";
import NodesList from "./NodesList";
import {
  linkLoader,
  selectAllFamilies,
  selectAllLinks,
  selectAllPersonNodes,
  TreeState,
} from "./reducer/treeReducer";
import { changeNodeVisibility } from "./reducer/updateNodes/changeNodeVisibility";
import { moveNode, moveNodeThunk } from "./reducer/updateNodes/moveNode";
import useTreeActions from "./TreeActionsProvider";
import { PersonNode } from "../../model/PersonNode";

type OwnProps = {
  onHideBranch: (family: FamilyNode) => void;
  onChildAdd: (
    data: CreateNodeRequestData,
    firstParent: number,
    secondParent?: number
  ) => void;
  onNodeDelete: (id: number, isUser: boolean) => void;
  scale: number;
} & any;

export type ConnectionMode = "AsChild" | "AsPartner" | "AsParent";
type ConnectionProps = {
  isConnecting: boolean;
  start: PersonNode | null;
  mode: ConnectionMode | null;
  possibleConnections: {
    nodes: number[];
    families: EntityId[];
  };
};

const TreeRenderer = (props: OwnProps) => {
  const {
    onAsChildConnect,
    onAsPartnerConnect,
    onBranchHide,
    onNodeDisconnect,
    onNodeVisibilityChange,
  } = useTreeActions();
  const dispatch = useThunkDispatch();
  const treeState = useSelector<ApplicationState, TreeState>(
    (state) => state.tree
  );
  const families = useSelector(selectAllFamilies);
  const links = useSelector(selectAllLinks);
  const nodes = useSelector(selectAllPersonNodes);
  const [connection, setConnection] = React.useState<ConnectionProps>({
    isConnecting: false,
    start: null,
    possibleConnections: {
      families: [],
      nodes: [],
    },
    mode: null,
  });

  const resetConnectingMode = () => {
    setConnection({
      isConnecting: false,
      possibleConnections: {
        families: [],
        nodes: [],
      },
      mode: null,
      start: null,
    });
  };

  const handleStopConnectingMode = (e: any) => {
    if (connection.isConnecting) {
      e.preventDefault();
      resetConnectingMode();
      return false;
    }
  };
  React.useEffect(() => {
    document.addEventListener("contextmenu", handleStopConnectingMode);
    return () => {
      document.removeEventListener("contextmenu", handleStopConnectingMode);
    };
  });

  //zmienia polozenia wezla w storze i bazie danych - tylko przy zakonczeniu ruchu
  const handleNodeMove = (node: Node, x: number, y: number) => {
    dispatch(moveNode(node as PersonNode, x, y));
    dispatch(moveNodeThunk({ nodeId: node.id as number, x, y }));
  };

  //przesuwa wezel lokalnie, na canvasie
  const handleMoveNodeOnCanvas = (e: any, node: Node) => {
    if (connection.isConnecting) {
      return;
    }
    moveNodeOnCanvas(e, node, nodes, families, treeState);
  };

  const handleFamilySelect = (familyNode: FamilyNode, event: any) => {
    const connectionMode = connection;
    if (connectionMode.isConnecting) {
      if (connectionMode.possibleConnections.families.includes(familyNode.id)) {
        onAsChildConnect(
          treeState.treeId as number,
          connection.start!.id as number,
          familyNode.fatherId as number,
          familyNode.motherId as number
        );
        resetConnectingMode();
      }
    } else {
      onBranchHide(familyNode);
    }
  };
  const handleNodeSelect = (personNode: PersonNode) => {
    if (connection.isConnecting) {
      if (
        connection.possibleConnections.nodes.includes(personNode.id as number)
      ) {
        if (connection.mode === "AsChild") {
          const startNode = connection.start;
          if (!startNode || (startNode.fatherId && startNode.motherId)) {
            resetConnectingMode();
            return;
          }
          var existingParent = startNode.fatherId ?? startNode.motherId;

          onAsChildConnect(
            treeState.treeId as number,
            connection.start!.id as number,
            personNode.id as number,
            existingParent as number
          );
        }
        if (connection.mode === "AsPartner") {
          onAsPartnerConnect(
            connection.start!.id as number,
            personNode.id as number
          );
        }
        if (connection.mode === "AsParent") {
          const startNode = connection.start;
          if (!startNode || (startNode.fatherId && startNode.motherId)) {
            resetConnectingMode();
            return;
          }
          var existingParent = personNode.fatherId ?? personNode.motherId;

          onAsChildConnect(
            treeState.treeId as number,

            personNode.id as number,
            connection.start!.id as number,
            existingParent as number
          );
        }
      }
      resetConnectingMode();
    } else {
      props.onEditNodeDialogOpen(personNode.id);
    }
  };

  const handleConnectStart = (node: PersonNode, mode: ConnectionMode) => {
    //REFACTOR
    Axios.post(baseURL + "/tree/node/possibleConnections", {
      mode: mode,
      nodeId: node.id,
    }).then((resp) => {
      setConnection({
        isConnecting: true,
        start: node,
        possibleConnections: resp.data,
        mode,
      });
    });
  };
  const loadedLinks = links
    .map((link: Link) => linkLoader(treeState, link))
    .filter((a: any) => a) as LinkLoaded[];

  return (
    <Fade in={true} timeout={3000}>
      <div>
        <NodesList
          onNodeVisiblityChange={onNodeVisibilityChange}
          onDisconnectNode={onNodeDisconnect}
          possibleConnections={connection.possibleConnections.nodes}
          disabled={connection.isConnecting}
          onConnectStart={handleConnectStart}
          scale={props.scale}
          nodes={nodes}
          onNodeSelect={handleNodeSelect}
          onNodeMove={handleNodeMove}
          onNodeDelete={props.onNodeDelete}
          onMoveNodeOnCanvas={handleMoveNodeOnCanvas}
        />
        <Families
          isConnecting={connection.isConnecting}
          possibleConnections={connection.possibleConnections.families}
          families={families}
          onSelect={handleFamilySelect}
        />
        <Links links={loadedLinks}>
          <FollowableLink
            enabled={connection.isConnecting}
            positionX={props.positionX}
            positionY={props.positionY}
            scale={props.scale}
            source={connection.start ?? { x: 1, y: 1 }}
          />
        </Links>
      </div>
    </Fade>
  );
};

export default TreeRenderer;
