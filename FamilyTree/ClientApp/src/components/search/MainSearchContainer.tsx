import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { useThunkDispatch } from "../..";
import { searchTrees } from "./redux/searchTreesReducer";
import { searchUsers } from "./redux/searchUsersReducer";
import Search from "./Search";

const useStyles = makeStyles((theme: Theme) => ({
  searchContainer: {
    position: "relative",
  },
  searchResults: {
    position: "absolute",
  },
}));

const MainSearchContainer = (props: any) => {
  const classes = useStyles();
  const dispatch = useThunkDispatch();

  const handleSearch = (query: string) => {
    dispatch(searchUsers({ query })).then((response: any) => {
      if (response.error) {
        //TODO co jak error ?
      }
    });
    dispatch(searchTrees({ query })).then((response: any) => {
      if (response.error) {
        //TODO co jak error ?
      }
    });
  };
  return (
    <div className={classes.searchContainer}>
      <Search onSearch={handleSearch}></Search>
      <div className={classes.searchResults}>
        <li>xddd</li>
        <li>xddd</li>
        <li>xddd</li>
        <li>xddd</li>
        <li>xddd</li>
      </div>
    </div>
  );
};

export default MainSearchContainer;
