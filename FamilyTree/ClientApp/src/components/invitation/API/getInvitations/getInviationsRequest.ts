import axios from "axios";
import { INVITATIONS_API_URL } from "../../../../helpers/apiHelpers";
import { Invitation } from "./../../../../model/Invitation";

export const GET_INVITATIONS_API_URL = `${INVITATIONS_API_URL}`;

export type GetInvitationsResponse = {
  invitations: Invitation[];
};

export const requestGetInvitations = () => {
  return axios.get<GetInvitationsResponse>(GET_INVITATIONS_API_URL);
};
