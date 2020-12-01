import {
  ActionCreatorWithPreparedPayload,
  AnyAction,
  createReducer,
} from "@reduxjs/toolkit";
import { AnyNaptrRecord } from "dns";
import { Reducer } from "redux";
import { createActionWithPayload, StatusState } from "../../../helpers/helpers";

interface StatusReducerCreator {
  // stopLoading: ActionCreatorWithPreparedPayload<{}[], any, string>;
  // startLoading: ActionCreatorWithPreparedPayload<{}[], any, string>;
  // receiveError: ActionCreatorWithPreparedPayload<unknown[], any, string>;
  // clearError: ActionCreatorWithPreparedPayload<unknown[], any, string>;
  stopLoading: any;
  startLoading: any;
  receiveError: any;
  clearError: any;
}
export interface Status {
  error: any;
  loading: boolean;
}
export const createStatusActions = (name: string): StatusReducerCreator => {
  const statusPath = name + "/status/";

  //Actions
  const stopLoading = createActionWithPayload<{}>(
    statusPath + "stoppedLoading"
  );
  const startLoading = createActionWithPayload<{}>(
    statusPath + "startedLoading"
  );
  const receiveError = createActionWithPayload<any>(
    statusPath + "receivedError"
  );
  const clearError = createActionWithPayload<any>(statusPath + "clearedError");

  return {
    stopLoading,
    startLoading,
    receiveError,
    clearError,
  };
};
