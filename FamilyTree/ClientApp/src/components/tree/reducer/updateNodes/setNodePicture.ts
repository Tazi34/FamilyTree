import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { ApplicationState } from "../../../../helpers";
import { treeAPI } from "../../API/treeAPI";
import {
  UploadNodePictureRequestData,
  UploadNodePictureResponse,
} from "./../../API/uploadPicture/uploadTreeNodePicture";

export const uploadTreeNodePictureRequest = createAsyncThunk<
  AxiosResponse<UploadNodePictureResponse>,
  UploadNodePictureRequestData
>(`tree/node/uploadTreeNodePicture`, async (data) => {
  return await treeAPI.uploadTreeNodePicture(data);
});
