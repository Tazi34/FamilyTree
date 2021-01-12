import { createActionWithPayload } from "./../../../helpers/helpers";
import { createReducer, createSelector } from "@reduxjs/toolkit";
import { ApplicationState } from "../../../helpers";

export type Alert = {
  message: string;
  type: "error" | "success" | "info";
};

export type AlertsState = {
  alerts: Alert[];
};

export const initialAlertsState = {
  alerts: [],
};

export const addAlert = createActionWithPayload<Alert>("alerts/alertAdded");

export const alertsReducer = createReducer<AlertsState>(
  initialAlertsState,
  (builder) => {
    builder.addCase(addAlert, (state, action) => {
      state.alerts.push(action.payload);
    });
  }
);

export const selectAlerts = createSelector<
  ApplicationState,
  ApplicationState,
  Alert[]
>(
  (state) => state,
  (state) => state.alerts.alerts
);
