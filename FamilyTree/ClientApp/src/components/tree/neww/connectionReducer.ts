import { createAction, createReducer, EntityId } from "@reduxjs/toolkit";

export interface ConnectionState {
  isConnecting: boolean;
  start: EntityId | null;
  end: EntityId | null;
}

const initialState: ConnectionState = {
  isConnecting: false,
  start: null,
  end: null,
};
const prefix = "tree/connection";
export const startConnecting = createAction<EntityId>(
  `${prefix}/connectionStarted`
);

export const finishConnection = createAction<EntityId>(
  `${prefix}/connectionFinished`
);

export const connectionReducer = createReducer<ConnectionState>(
  initialState,
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
