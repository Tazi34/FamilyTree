import axios from "axios";
import { SEARCH_API_URL } from "../../../helpers/apiHelpers";

export type SearchTreeDTO = {
  treeId: number;
  name: string;
  isPrivate: boolean;
};
export type SearchQueryTreesRequestData = {
  query: string;
};

export type SearchQueryTreesResponse = {
  trees: SearchTreeDTO[];
};

export const requestSearchQueryTrees = (data: SearchQueryTreesRequestData) => {
  return axios.get<SearchQueryTreesResponse>(
    `${SEARCH_API_URL}/tree/${data.query}`
  );
};
