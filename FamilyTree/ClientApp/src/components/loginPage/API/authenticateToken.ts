import axios from "axios";
import { LOGIN_API_URL } from "../../../helpers/apiHelpers";
import { Sex } from "../../../model/Sex";

export type AuthenticateTokenRequestData = {
  token: string;
};

export type AuthenticateTokenResponse = {
  userId: 0;
  name: string;
  surname: string;
  email: string;
  token: string;
  role: string;
  maidenName: string;
  birthday: string;
  pictureUrl: string;
  sex: Sex;
};

export const requestAuthenticateToken = (
  data: AuthenticateTokenRequestData
) => {
  return axios.get<AuthenticateTokenResponse>(`${LOGIN_API_URL}`, {
    headers: {
      Authorization: "Bearer " + data.token,
    },
  });
};
