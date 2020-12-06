import React from "react";
import { useHistory } from "react-router";
import Button from "@material-ui/core/Button";
type RedirectButtonProps = {
  to: string;
} & any;

export const RedirectButton = ({ to, ...props }: RedirectButtonProps) => {
  const history = useHistory();

  return (
    <Button
      {...props}
      onClick={() => {
        if (history.location.pathname.localeCompare(to) == 0) {
          history.go(0);
        } else {
          history.push(to);
        }
      }}
    />
  );
};
