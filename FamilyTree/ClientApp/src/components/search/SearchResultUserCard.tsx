import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { SearchUserDTO } from "./API/searchQuery";

const useStyles = makeStyles((theme: Theme) => ({}));
type Props = {
  user: SearchUserDTO;
};
const SearchResultUserCard = ({ user }: Props) => {
  const classes = useStyles();
  return (
    <div>
      {user.name} {user.surname}
    </div>
  );
};

export default SearchResultUserCard;
