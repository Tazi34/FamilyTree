import { FullUserInformation } from "./../../../model/UserInformation";
import { PROFILE_API_URL } from "./../../../helpers/apiHelpers";
import axios from "axios";

export type EditProfileRequestData = {
  userId: number;
  name: string;
  surname: string;
  email: string;
  birthday: string;
  previousSurnames: string[];
  sex: "Male" | "Female" | "NotSure";
};
export type EditProfileResponse = FullUserInformation;

export const requestEditProfile = (data: EditProfileRequestData) => {
  return axios.put<EditProfileResponse>(`${PROFILE_API_URL}`, data);
};
