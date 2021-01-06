import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import {
  ConnectPartnersRequestData,
  ConnectPartnersResponse,
} from "../../API/connectNodes/connectPartnerRequest";
import { treeAPI } from "../../API/treeAPI";
import { setTree } from "../treeReducer";

export const connectPartners = (data: ConnectPartnersRequestData) => (
  dispatch: any
) => {
  dispatch(connectPartnersThunk(data)).then((response: any) => {
    if (response.type === connectPartnersThunk.fulfilled.toString()) {
      dispatch(setTree(response.payload.data));
    }
  });
};
export const connectPartnersThunk = createAsyncThunk<
  AxiosResponse<ConnectPartnersResponse>,
  ConnectPartnersRequestData
>("tree/Partners/connect", async (data) => {
  return treeAPI.connectPartnersRequest(data);
});
