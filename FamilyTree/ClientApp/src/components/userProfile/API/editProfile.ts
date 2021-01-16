import { editProfileBlog } from "./../../blog/redux/postsReducer";
import { FullUserInformation } from "./../../../model/UserInformation";
import { PROFILE_API_URL } from "./../../../helpers/apiHelpers";

import axios from "axios";
import { editUser } from "../../loginPage/authenticationReducer";

export type EditProfileRequestData = {
  userId: number;
  name: string;
  surname: string;
  email: string;
  birthday: string;
  maidenName: string;
  sex: "Male" | "Female" | "NotSure";
};
export type EditProfileResponse = FullUserInformation;

export const editProfile = (data: EditProfileRequestData) => (
  dispatch: any
) => {
  return requestEditProfile(data).then((resp) => {
    dispatch(editProfileBlog(resp.data));
    dispatch(editUser(resp.data));
    return resp;
  });
};

export const requestEditProfile = (data: EditProfileRequestData) => {
  data.birthday = new Date(data.birthday).toISOString();
  return axios.put<EditProfileResponse>(`${PROFILE_API_URL}`, data);
};
