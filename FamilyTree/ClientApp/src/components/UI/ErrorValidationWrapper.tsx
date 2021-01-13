import { makeStyles, TextField } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import ValidationErrorText from "./ValidationErrorText";

const useStyles = makeStyles((theme: Theme) => ({}));
type Props = {
  error: any;
  touched: any;
  children: any;
};
const ErrorValidationWrapper = ({ error, touched, children }: Props) => {
  const classes = useStyles();
  const showError = error && touched;
  return (
    <div>
      {React.cloneElement(children, {
        error: showError,
        helperText: showError ? error : "",
      })}
    </div>
  );
};

export default ErrorValidationWrapper;
