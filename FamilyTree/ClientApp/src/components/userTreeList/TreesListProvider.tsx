import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { sampleTreesInformations } from "../../samples/componentsSampleData";
import TreesList from "./TreesList";

const useStyles = makeStyles((theme: Theme) => ({}));

const TreesListProvider = (props: any) => {
  const classes = useStyles();
  return <TreesList trees={sampleTreesInformations}></TreesList>;
};

export default TreesListProvider;
