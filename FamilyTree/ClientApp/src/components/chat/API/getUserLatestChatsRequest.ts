import axios from "axios";
import { CHAT_API_URL } from "../../../helpers/apiHelpers";
import { Chat } from "../chatReducer";

export type GetLatestUserChatsData = {
  id: number;
};

export type GetLatestUserChatsResponse = {
  usersList: Chat[];
};

export const requestLatestChats = () => {
  return axios.get<GetLatestUserChatsResponse>(CHAT_API_URL);
};
