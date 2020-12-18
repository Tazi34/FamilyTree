import axios from "axios";
import { CHAT_API_URL } from "../../../helpers/apiHelpers";
import { Chat, Message } from "../chatReducer";

export type GetMessagesRequestData = {
  id: number;
};

export type GetMessagesResponse = {
  messageList: Message[];
};

export const requestMessages = (data: GetMessagesRequestData) => {
  return axios.get<GetMessagesResponse>(`${CHAT_API_URL}/messages/${data.id}`);
};
