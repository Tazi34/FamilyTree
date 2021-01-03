import axios from "axios";
import { INVITATIONS_API_URL } from "../../../../helpers/apiHelpers";

export type SendInvitationRequestData = {
  hostUserId: number;
  askedUserId: number;
  treeId: number;
};

export type SendInvitationResponse = {};

export const requestSendInvitation = (data: SendInvitationRequestData) => {
  return axios.post<SendInvitationResponse>(`${INVITATIONS_API_URL}`, data);
};
