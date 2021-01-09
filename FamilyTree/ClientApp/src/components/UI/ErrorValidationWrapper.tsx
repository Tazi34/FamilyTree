import { makeStyles, TextField } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import ValidationErrorText from "./ValidationErrorText";

const useStyles = makeStyles((theme: Theme) => ({}));

const ErrorValidationWrapper = ({ error, touched, children }: any) => {
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
