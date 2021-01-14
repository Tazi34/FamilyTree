import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";

const useStyles = makeStyles((theme: Theme) => ({}));

const PictureOrPlaceholder = (props: any) => {
  const classes = useStyles();
  return <div></div>;
};

export default PictureOrPlaceholder;
