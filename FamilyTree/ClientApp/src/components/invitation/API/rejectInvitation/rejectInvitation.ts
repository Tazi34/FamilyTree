import axios from "axios";
import { INVITATIONS_API_URL } from "../../../../helpers/apiHelpers";

export type RejectInvitationRequestData = {
  invitationId: number;
  userId: number;
};

export type RejectInvitationResponse = {};

export const requestRejectInvitation = (data: RejectInvitationRequestData) => {
  return axios.post<RejectInvitationResponse>(
    `${INVITATIONS_API_URL}/refuse`,
    data
  );
};
