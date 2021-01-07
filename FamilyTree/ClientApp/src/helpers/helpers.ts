import {
  ActionReducerMapBuilder,
  AnyAction,
  AsyncThunk,
  createAction,
  EntityState,
} from "@reduxjs/toolkit";
function withPayloadType<T>() {
  return (t: T) => ({ payload: t });
}
export const createActionWithPayload = <T>(action: string) =>
  createAction(action, withPayloadType<T>());
export { createAction };
export interface NormalizedObjects<T> {
  byId: { [id: number]: T };
  allIds: number[];
}

export interface StatusState {
  loading: boolean;
  error: any;
}
export function areEqualShallow(a: any, b: any) {
  for (var key in a) {
    if (a[key] !== b[key]) {
      return false;
    }
  }
  return true;
}
export const addThunkWithStatusHandlers = <R, A, S>(
  builder: ActionReducerMapBuilder<any>,
  asyncThunkAction: AsyncThunk<R, A, any>,
  fullFilledHandler?: (state: S, action: AnyAction) => void,
  pendingHandler?: (state: S, action: AnyAction) => void,
  rejectedHandler?: (state: S, action: AnyAction) => void
) => {
  builder
    .addCase(asyncThunkAction.fulfilled, (state, action) => {
      state.status.loading = false;
      state.status.error = null;
      if (fullFilledHandler) {
        fullFilledHandler(state, action);
      }
    })
    .addCase(asyncThunkAction.pending, (state, action) => {
      state.status.loading = true;
      state.status.error = null;
      if (pendingHandler) {
        pendingHandler(state, action);
      }
    })
    .addCase(asyncThunkAction.rejected, (state, action) => {
      state.status.loading = false;
      state.status.error = action.error;
      if (rejectedHandler) {
        rejectedHandler(state, action);
      }
    });
};

export const mapCollectionToEntity = <T>(entities: T[]): EntityState<T> => {
  const state: EntityState<T> = {
    ids: [],
    entities: {},
  };

  entities.forEach((entity) => {
    const id = (entity as any).id;
    state.ids.push(id);
    state.entities[id] = entity;
  });
  return state;
};
