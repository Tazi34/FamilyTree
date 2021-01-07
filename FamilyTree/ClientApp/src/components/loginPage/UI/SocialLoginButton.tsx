import { Button, makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";

const useStyles = makeStyles((theme: Theme) => ({}));

const SocialLoginButton = (props: any) => {
  const classes = useStyles();
  return <Button>{props.children}</Button>;
};

export default SocialLoginButton;
