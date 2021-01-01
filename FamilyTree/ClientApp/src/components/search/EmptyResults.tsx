import { makeStyles, Paper, Typography } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";

const useStyles = makeStyles((theme: Theme) => ({
  emptyResultsContainer: {
    height: 50,
    padding: 10,
    display: "flex",
    alignItems: "center",
  },
}));

const EmptyResults = (props: any) => {
  const classes = useStyles();
  return (
    <Paper className={classes.emptyResultsContainer}>
      <Typography>No results found</Typography>
    </Paper>
  );
};

export default EmptyResults;
