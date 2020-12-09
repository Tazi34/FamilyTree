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
    maxWidth: 350,
    width: "80%",
    margin: "0 auto",
    height: "100%",
    maring: "0 auto",
    diplay: "flex",
    alignItems: "center",
  },
  paper: {
    maxWidth: 350,
    margin: "100px 10px",
    position: "fixed",
    padding: "10px 5px",
    width: "calc(16%)",
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
    height: "400px",
  },
  title: {
    color: theme.palette.primary.dark,
  },
}));

const UserTreePanel = (props: any) => {
  const classes = useStyles();
  return (
    <Box display="flex" flexDirection="column" className={classes.container}>
      {/* <div className={classes.flexGrow}></div> */}
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
