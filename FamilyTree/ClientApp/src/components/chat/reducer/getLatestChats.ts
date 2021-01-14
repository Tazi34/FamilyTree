import { GetLatestUserChatsResponse } from "../API/getUserLatestChatsRequest";
import { AxiosResponse } from "axios";
import chatAPI from "../API/chatAPI";
import { chatActionsPrefix } from "../chatReducer";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getLatestChats = createAsyncThunk<
  AxiosResponse<GetLatestUserChatsResponse>,
  number
>(`${chatActionsPrefix}/usersLatestChatsAcquired`, async () => {
  return await chatAPI.requestLatestChats();
});
