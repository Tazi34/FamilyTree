import { createAction, createReducer, createSelector } from "@reduxjs/toolkit";
import { createActionWithPayload } from "./../../../helpers/helpers";

export type CanvasState = {
  disabledZoom: boolean;
} & Transform &
  CanvasSize;
export type Transform = {
  x: number;
  y: number;
  scale: number;
};
export type CanvasSize = {
  width: number;
  height: number;
};
export const initialCanvasState = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  scale: 1,
  disabledZoom: false,
};

export const transformCanvas = createActionWithPayload<Transform>(
  "canvas/canvasTransformed"
);
export const resizeCanvas = createActionWithPayload<CanvasSize>(
  "canvas/canvasResized"
);
export const disableZoom = createAction("canvas/zoomDisabled");
export const enableZoom = createAction("canvas/zoomEnabled");

export const canvasReducer = createReducer<CanvasState>(
  initialCanvasState,
  (builder) => {
    builder
      .addCase(transformCanvas, (state, action) => {
        return { ...state, ...action.payload };
      })
      .addCase(disableZoom, (state, action) => {
        state.disabledZoom = true;
      })
      .addCase(enableZoom, (state, action) => {
        state.disabledZoom = false;
      })
      .addCase(resizeCanvas, (state, action) => {
        state.width = action.payload.width ?? 0;
        state.height = action.payload.height ?? 0;
      });
  }
);

export const selectCanvas = createSelector<any, any, CanvasState>(
  (state) => state,
  (state) => state.canvas
);
export const selectCanvasCenter = createSelector<
  any,
  any,
  { x: number; y: number }
>(
  (state) => state,
  (state) => {
    const center = {
      x: (-state.canvas.x + state.canvas.width / 2) / state.canvas.scale,
      y: (-state.canvas.y + state.canvas.height / 2) / state.canvas.scale,
    };

    return center;
  }
);
