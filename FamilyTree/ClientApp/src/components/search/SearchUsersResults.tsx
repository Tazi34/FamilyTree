import { makeStyles, Paper } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { SearchUserDTO } from "./API/searchQuery";
import EmptyResults from "./EmptyResults";
import { SearchResultsDTO } from "./redux/searchReducer";
import SearchResultCard from "./SearchResultCard";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    maxHeight: 400,
    overflowY: "auto",
  },
}));
type Props = {
  results: SearchUserDTO[];
  onUserSelect: (id: number) => any;
};
const firstNResults = 4;
const SearchUsersResults = ({ results, onUserSelect }: Props) => {
  const classes = useStyles();
  const resultsCount = results.length;
  const isEmpty = resultsCount === 0;

  if (isEmpty) {
    return <EmptyResults />;
  }
  return (
    <Paper className={classes.root}>
      {results.map((user) => (
        <SearchResultCard
          key={user.userId}
          entityId={user.userId}
          onSelect={onUserSelect}
          text={`${user.name} ${user.surname}`}
          pictureUrl={user.pictureUrl}
          user={true}
        />
      ))}
    </Paper>
  );
};

export default SearchUsersResults;
