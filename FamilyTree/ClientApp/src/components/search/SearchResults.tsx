import { makeStyles, Paper, Popover } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { SearchResultsDTO } from "./redux/serachReducer";

const useStyles = makeStyles((theme: Theme) => ({
  entryContainer: {
    width: "100%",
  },
}));
type Props = {
  onClose: () => void;
  results: SearchResultsDTO;
};
const SearchResults = ({ onClose, results }: Props) => {
  const classes = useStyles();
  return (
    <Paper>
      {results.trees.map((tree) => (
        <div className={classes.entryContainer}>{tree.name}</div>
      ))}
      {results.users.map((user) => (
        <div className={classes.entryContainer}>
          {user.name} {user.surname}
        </div>
      ))}
    </Paper>
  );
};

export default SearchResults;
