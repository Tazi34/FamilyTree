import { GetLatestUserChatsResponse } from "../API/getUserLatestChatsRequest";
import { AxiosResponse } from "axios";
import chatAPI from "../API/chatAPI";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getLatestChats = createAsyncThunk<
  AxiosResponse<GetLatestUserChatsResponse>,
  number
>(`chat/usersLatestChatsAcquired`, async () => {
  return await chatAPI.requestLatestChats();
});
