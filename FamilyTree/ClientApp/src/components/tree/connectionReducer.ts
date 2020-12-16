import { selectSelf } from "./../loginPage/authenticationReducer";
import {
  createAction,
  createDraftSafeSelector,
  createReducer,
  EntityId,
} from "@reduxjs/toolkit";

export interface ConnectionState {
  isConnecting: boolean;
  start: ConnectionPoint | null;
  end: ConnectionPoint | null;
}

export type ConnectionPoint = {
  id: EntityId;
  x: number;
  y: number;
};

export const connectionsInitialState: ConnectionState = {
  isConnecting: false,
  start: null,
  end: null,
};
const prefix = "tree/connection";
export const startConnecting = createAction<ConnectionPoint>(
  `${prefix}/connectionStarted`
);

export const finishConnection = createAction<ConnectionPoint>(
  `${prefix}/connectionFinished`
);

export const connectionReducer = createReducer<ConnectionState>(
  connectionsInitialState,
  (builder) => {
    builder
      .addCase(startConnecting, (state, action) => {
        state.isConnecting = true;
        state.start = action.payload;
      })
      .addCase(finishConnection, (state, action) => {
        state.isConnecting = false;
        state.end = action.payload;
      });
  }
);

export const isConnectingSelector = createDraftSafeSelector(
  selectSelf,
  (state) => state.connection.isConnecting
);
export const connectionStartPointSelector = createDraftSafeSelector(
  selectSelf,
  (state) => state.connection.start
);
