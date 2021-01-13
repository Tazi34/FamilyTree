import { makeStyles, TextField } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";

const useStyles = makeStyles((theme: Theme) => ({
  description: {
    width: "100%",
  },
  descriptionRoot: {
    padding: 5,
    minHeight: 200,
  },
}));

type Props = {
  readonly?: boolean;
  [x: string]: any;
};
const TreeNodeDescription = ({ readOnly, ...props }: Props) => {
  const classes = useStyles();
  return (
    <div className={classes.descriptionRoot}>
      <TextField
        InputProps={{
          style: {
            color: "rgba(0, 0, 0, 0.87)",
          },
        }}
        label="Description"
        disabled={readOnly}
        multiline
        rows={8}
        rowsMax={14}
        variant="outlined"
        className={classes.description}
        {...props}
      />
    </div>
  );
};

export default TreeNodeDescription;
