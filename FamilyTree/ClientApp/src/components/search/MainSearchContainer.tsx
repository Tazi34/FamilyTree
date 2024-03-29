import { ClickAwayListener, makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useThunkDispatch } from "../..";
import { BLOG_PAGE_URI, TREE_PAGE_URI } from "../../applicationRouting";
import {
  search,
  SearchResultsDTO,
  searchResultSelector,
} from "./redux/searchReducer";
import Search from "./Search";
import SearchResults from "./SearchResults";

const useStyles = makeStyles((theme: Theme) => ({
  searchContainer: {
    position: "relative",
  },
  searchResults: {
    minWidth: "100%",
    position: "absolute",
  },
}));
const WAIT_INTERVAL = 500;

const MainSearchContainer = () => {
  const classes = useStyles();
  const dispatch = useThunkDispatch();
  const [searchResultsList, setSearchResultsList] = React.useState(false);
  const searchResults: SearchResultsDTO = useSelector(searchResultSelector);
  const anchor = React.useRef<any>(null);
  const history = useHistory();
  const [query, setQuery] = React.useState("");
  const timerRef = React.useRef<any>(undefined);

  const handleSearch = (query: string) => {
    dispatch(search({ query }))
      .then((response: any) => {
        if (response.error) {
        }
      })
      .then(() => setSearchResultsList(true));
  };

  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    const newValue = e.target.value;
    if (Boolean(newValue)) {
      timerRef.current = setTimeout(
        () => handleSearch(newValue),
        WAIT_INTERVAL
      );
    }
    setQuery(newValue);
  };
  const handleClose = () => {
    setSearchResultsList(false);
    setQuery("");
  };

  const handleUserSelect = (id: number) => {
    history.push(`${BLOG_PAGE_URI}/${id}`);
    handleClose();
  };

  const handleTreeSelect = (id: number) => {
    history.push(`${TREE_PAGE_URI}/${id}`);
    handleClose();
  };
  return (
    <div className={classes.searchContainer}>
      <div ref={anchor}>
        <Search onChange={handleSearchChange} query={query}></Search>
      </div>

      <ClickAwayListener onClickAway={() => setSearchResultsList(false)}>
        <div className={classes.searchResults}>
          {searchResultsList && (
            <SearchResults
              results={searchResults}
              onTreeSelect={handleTreeSelect}
              onUserSelect={handleUserSelect}
            />
          )}
        </div>
      </ClickAwayListener>
    </div>
  );
};

export default MainSearchContainer;
