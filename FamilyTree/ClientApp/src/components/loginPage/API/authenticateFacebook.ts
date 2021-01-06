import axios from "axios";
import { FullUserInformation } from "../../../model/UserInformation";
import { FACEBOOK_AUTHENTICATION_API_URL } from "../../../helpers/apiHelpers";

export type AuthenticateFacebookRequestData = {
  idToken: string;
};

export type AuthenticateFacebookResponse = FullUserInformation;

export const requestAuthenticateFacebook = (
  data: AuthenticateFacebookRequestData
) => {
  return axios.get(`${FACEBOOK_AUTHENTICATION_API_URL}/${data.idToken}`);
};
