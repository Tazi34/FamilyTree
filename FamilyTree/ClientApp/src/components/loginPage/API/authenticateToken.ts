import axios from "axios";
import { LOGIN_API_URL } from "../../../helpers/apiHelpers";

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
  previousSurnames: string[];
  birthday: string;
  pictureUrl: string;
  sex: "Male" | "Female" | "Not Sure";
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
