import * as React from "react";

type Props = {
  error: any;
  touched: any;
  children: any;
};
const ErrorValidationWrapper = ({ error, touched, children }: Props) => {
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
