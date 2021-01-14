import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { PersonNode } from "../../../../model/PersonNode";
import { treeAPI } from "../../API/treeAPI";
import {
  MoveNodeRequestData,
  MoveNodeResponse,
} from "./../../API/moveNode/moveNodeRequest";

export const moveNodeThunk = createAsyncThunk<
  AxiosResponse<MoveNodeResponse>,
  MoveNodeRequestData
>(`tree/node/moveNode`, async (data) => {
  const dataNormalized: MoveNodeRequestData = {
    nodeId: data.nodeId,
    x: Math.floor(data.x),
    y: Math.floor(data.y),
  };
  return await treeAPI.moveTreeNode(dataNormalized);
});

export const moveNode = createAction(
  `$tree/node/nodeMoved`,
  (node: PersonNode, x: number, y: number): any => ({
    payload: { node, x: Math.floor(x), y: Math.floor(y) },
  })
);
