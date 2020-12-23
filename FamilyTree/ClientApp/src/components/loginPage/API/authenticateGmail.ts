import { GOOGLE_AUTHENTICATION_API_URL } from "./../../../helpers/apiHelpers";
import axios from "axios";
import { FullUserInformation } from "../../../model/UserInformation";

export type AuthenticateGmailRequestData = {
  idToken: string;
};

export type AuthenticateGmailResponse = FullUserInformation;

export const requestAuthenticateGmail = (
  data: AuthenticateGmailRequestData
) => {
  return axios.post(GOOGLE_AUTHENTICATION_API_URL, data);
};
