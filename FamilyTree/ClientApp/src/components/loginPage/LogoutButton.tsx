import { Button, makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { useHistory } from "react-router";

const LogoutButton = (props: any) => {
  const history = useHistory();

  return <Button onClick={() => history.push("/logout")} {...props} />;
};

export default LogoutButton;
