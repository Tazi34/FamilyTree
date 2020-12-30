import { ButtonBase, makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    width: "100%",
    padding: 8,
    marginBottom: 5,
  },
}));

const SearchResultCard = (props: any) => {
  const classes = useStyles();
  return <ButtonBase className={classes.card}>{props.children}</ButtonBase>;
};

export default SearchResultCard;
