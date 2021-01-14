import axios from "axios";
import { SEARCH_API_URL } from "../../../helpers/apiHelpers";
export type SearchTreeDTO = {
  treeId: number;
  name: string;
  isPrivate: boolean;
};
export type SearchUserDTO = {
  userId: number;
  name: string;
  surname: string;
  pictureUrl: string;
  prevSurnames: string[];
};
export type SearchQueryRequestData = {
  query: string;
};

export type SearchQueryResponse = {
  users: SearchUserDTO[];
  trees: SearchTreeDTO[];
};

export const requestSearchQuery = (data: SearchQueryRequestData) => {
  return axios.get<SearchQueryResponse>(`${SEARCH_API_URL}/${data.query}`);
};
