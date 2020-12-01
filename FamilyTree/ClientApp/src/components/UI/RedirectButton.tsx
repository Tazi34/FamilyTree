import React from "react";
import { useHistory } from "react-router";
import Button from "@material-ui/core/Button";
type RedirectButtonProps = {
  to: string;
  props: any;
};

export const RedirectButton = ({ to, ...props }: RedirectButtonProps) => {
  const history = useHistory();
  return <Button {...props} onClick={() => history.push(to)} />;
};
