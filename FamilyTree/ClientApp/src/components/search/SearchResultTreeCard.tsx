import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { SearchTreeDTO } from "./API/searchQuery";

const useStyles = makeStyles((theme: Theme) => ({}));
type Props = {
  tree: SearchTreeDTO;
};
const SearchResultTreeCard = ({ tree }: Props) => {
  const classes = useStyles();
  return <div>{tree.name}</div>;
};

export default SearchResultTreeCard;
