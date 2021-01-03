import { TreeAPI } from "./../../../tree/API/utils/TreeModel";
import axios from "axios";
import { INVITATIONS_API_URL } from "../../../../helpers/apiHelpers";

export type AcceptInvitationRequestData = {
  invitationId: number;
  userId: number;
};

export type AcceptInvitationResponse = TreeAPI;

export const requestAcceptInvitation = (data: AcceptInvitationRequestData) => {
  return axios.post<AcceptInvitationResponse>(
    `${INVITATIONS_API_URL}/accept`,
    data
  );
};
