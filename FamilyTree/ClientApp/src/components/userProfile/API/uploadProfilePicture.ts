import { FullUserInformation } from "./../../../model/UserInformation";
import { PROFILE_API_URL } from "./../../../helpers/apiHelpers";
import axios from "axios";

export type UploadProfilePictureRequestData = {
  picture: any;
};
export type UploadProfilePictureResponse = FullUserInformation;

export const requestUploadProfilePicture = (
  data: UploadProfilePictureRequestData
) => {
  const form = new FormData();
  form.append("picture", data.picture);
  return axios.post<UploadProfilePictureResponse>(
    `${PROFILE_API_URL}/picture`,
    form
  );
};
