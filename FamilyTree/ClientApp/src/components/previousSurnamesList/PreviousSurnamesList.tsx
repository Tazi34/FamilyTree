import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";

const useStyles = makeStyles((theme: Theme) => ({}));

type Props = {
  previousSurnames: string[];
  onSurnameDelete: () => void;
  onSurnameSelect: (surname: string) => void;
};
const PreviousSurnamesList = (props: any) => {
  const classes = useStyles();
  return <div></div>;
};

export default PreviousSurnamesList;
