import {
  Box,
  Button,
  Container,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import TreesListProvider from "./TreesListProvider";

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    width: "100%",
    height: "100%",
    maring: "0 auto",
  },
  paper: {
    maxWidth: 300,
    maxHeight: 450,
    width: "90%",
    margin: "0 auto",
    padding: "10px 5px",
  },
  flexGrow: {
    flex: 0.2,
  },
  createButton: {
    margin: 10,
    maxHeight: 40,
  },
  treeList: {
    height: "80%",
  },
  flexBox: {
    height: "100%",
  },
  title: {
    color: theme.palette.primary.dark,
  },
}));

const UserTreePanel = (props: any) => {
  const classes = useStyles();
  return (
    <Box display="flex" flexDirection="column" className={classes.container}>
      <div className={classes.flexGrow}></div>
      <Paper className={classes.paper}>
        <Box
          display="flex"
          flexDirection="column"
          className={classes.flexBox}
          justifyContent="space-between"
        >
          <Typography variant="h6" align="center" className={classes.title}>
            Trees
          </Typography>

          <div className={classes.treeList}>
            <TreesListProvider></TreesListProvider>
          </div>

          <Button
            variant="contained"
            color="primary"
            className={classes.createButton}
            size={"small"}
          >
            Create
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default UserTreePanel;
