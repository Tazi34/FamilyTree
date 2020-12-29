import axios from "axios";
import { SEARCH_API_URL } from "../../../helpers/apiHelpers";

export type SearchUserDTO = {
  userId: number;
  name: string;
  surname: string;
  pictureUrl: string;
  prevSurnames: string[];
};
export type SearchQueryUsersRequestData = {
  query: string;
};

export type SearchQueryUsersResponse = {
  users: SearchUserDTO[];
};

export const requestSearchQueryUsers = (data: SearchQueryUsersRequestData) => {
  return axios.get<SearchQueryUsersResponse>(
    `${SEARCH_API_URL}/user/${data.query}`
  );
};
