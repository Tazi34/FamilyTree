import {
  ClickAwayListener,
  Dialog,
  makeStyles,
  Menu,
  MenuItem,
  Popover,
} from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { useSelector } from "react-redux";
import { useThunkDispatch } from "../..";
import { searchTrees } from "./redux/searchTreesReducer";
import { searchUsers } from "./redux/searchUsersReducer";
import { searchResultSelector } from "./redux/serachReducer";
import Search from "./Search";
import SearchResults from "./SearchResults";

const useStyles = makeStyles((theme: Theme) => ({
  searchContainer: {
    position: "relative",
  },
  searchResults: {
    width: "100%",
    position: "absolute",
  },
}));

const MainSearchContainer = (props: any) => {
  const classes = useStyles();
  const dispatch = useThunkDispatch();
  const [searchResultsList, setSearchResultsList] = React.useState(false);
  const searchResults = useSelector(searchResultSelector);
  console.log(searchResults);
  const anchor = React.useRef<any>(null);

  const handleSearch = (query: string) => {
    dispatch(searchUsers({ query })).then((response: any) => {
      if (response.error) {
        //TODO co jak error ?
      }
    });
    dispatch(searchTrees({ query }))
      .then((response: any) => {
        if (response.error) {
          //TODO co jak error ?
        }
      })
      .then(() => setSearchResultsList(true));
  };
  const handleClose = () => {
    setSearchResultsList(false);
  };
  return (
    <div className={classes.searchContainer}>
      <div ref={anchor}>
        <Search onSearch={handleSearch}></Search>
      </div>

      <ClickAwayListener onClickAway={() => setSearchResultsList(false)}>
        <div className={classes.searchResults}>
          {searchResultsList && (
            <SearchResults results={searchResults} onClose={handleClose} />
          )}
        </div>
      </ClickAwayListener>
    </div>
  );
};

export default MainSearchContainer;
