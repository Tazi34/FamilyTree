import axios from "axios";
import { CHAT_API_URL } from "../../../helpers/apiHelpers";
import { Chat } from "../chatReducer";

export type GetChatRequestData = {
  id: number;
};

export type GetChatResponse = Chat;

export const requestChat = (data: GetChatRequestData) => {
  return axios.get<GetChatResponse>(`${CHAT_API_URL}/${data.id}`);
};
