import { ClickAwayListener, makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { useSelector } from "react-redux";
import { useThunkDispatch } from "../..";
import {
  search,
  SearchResultsDTO,
  searchResultSelector,
} from "./redux/searchReducer";
import Search from "./Search";
import SearchUsersResults from "./SearchUsersResults";

const useStyles = makeStyles((theme: Theme) => ({
  searchResults: {
    zIndex: 1000000,
    width: "100%",
    position: "absolute",
  },
}));
const WAIT_INTERVAL = 500;
type Props = {
  onSelectUser: (id: number) => any;
};
const SearchUsersContainer = (props: Props) => {
  const classes = useStyles();
  const dispatch = useThunkDispatch();
  const [searchResultsList, setSearchResultsList] = React.useState(false);
  const searchResults: SearchResultsDTO = useSelector(searchResultSelector);
  const anchor = React.useRef<any>(null);
  const [query, setQuery] = React.useState("");
  const timerRef = React.useRef<any>(undefined);

  const handleSearch = (query: string) => {
    dispatch(search({ query }))
      .then((response: any) => {
        if (response.error) {
          //TODO co jak error ?
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

  return (
    <div>
      <div ref={anchor}>
        <Search onChange={handleSearchChange} query={query}></Search>
      </div>

      <ClickAwayListener
        onClickAway={() => {
          setSearchResultsList(false);
        }}
      >
        <div className={classes.searchResults}>
          {searchResultsList && (
            <SearchUsersResults
              results={searchResults.users}
              onUserSelect={props.onSelectUser}
            />
          )}
        </div>
      </ClickAwayListener>
    </div>
  );
};

export default SearchUsersContainer;
