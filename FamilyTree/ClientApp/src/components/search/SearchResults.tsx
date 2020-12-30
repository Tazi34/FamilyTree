import { makeStyles, Paper, Popover } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { SearchResultsDTO } from "./redux/searchReducer";

import SearchResultCard from "./SearchResultCard";
import SearchResultTreeCard from "./SearchResultTreeCard";
import SearchResultUserCard from "./SearchResultUserCard";

const useStyles = makeStyles((theme: Theme) => ({}));
type Props = {
  onClose: () => void;
  results: SearchResultsDTO;
};
const SearchResults = ({ onClose, results }: Props) => {
  const classes = useStyles();
  return (
    <Paper>
      {results.trees.map((tree) => (
        <SearchResultCard>
          <SearchResultTreeCard tree={tree} />
        </SearchResultCard>
      ))}
      {results.users.map((user) => (
        <SearchResultCard>
          <SearchResultUserCard user={user} />
        </SearchResultCard>
      ))}
    </Paper>
  );
};

export default SearchResults;
