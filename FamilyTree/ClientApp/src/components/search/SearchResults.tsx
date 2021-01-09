import { Divider, makeStyles, Paper } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import EmptyResults from "./EmptyResults";
import { SearchResultsDTO } from "./redux/searchReducer";
import SearchResultCard from "./SearchResultCard";

const useStyles = makeStyles((theme: Theme) => ({}));
type Props = {
  results: SearchResultsDTO;
  onTreeSelect: (id: number) => any;
  onUserSelect: (id: number) => any;
};
const firstNResults = 4;
const SearchResults = ({ results, onUserSelect, onTreeSelect }: Props) => {
  const classes = useStyles();
  const resultsCount = results.users.length + results.trees.length;
  const isEmpty = resultsCount === 0;

  if (isEmpty) {
    return <EmptyResults />;
  }
  return (
    <Paper>
      {results.trees.slice(0, firstNResults).map((tree) => (
        <div>
          <Divider />
          <SearchResultCard
            key={tree.treeId}
            entityId={tree.treeId}
            text={tree.name}
            pictureUrl={null}
            user={false}
            onSelect={onTreeSelect}
          />
        </div>
      ))}
      {results.users.slice(0, firstNResults).map((user) => (
        <div>
          <Divider />
          <SearchResultCard
            key={user.userId}
            entityId={user.userId}
            onSelect={onUserSelect}
            text={`${user.name} ${user.surname}`}
            pictureUrl={user.pictureUrl}
            user={true}
          />
        </div>
      ))}
    </Paper>
  );
};

export default SearchResults;
