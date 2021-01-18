import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { useSelector } from "react-redux";
import ChatsContainer from "../chat/ChatsContainer";
import FriendsPanel from "../friendList/FriendsPanel";
import { getUser } from "../loginPage/authenticationReducer";
import ResponsiveMainColumn from "../ResponsiveMainColumn/ResponsiveMainColumn";
import LayoutBase from "./LayoutBase";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: "100%",
    width: "100%",
  },
  bottomFixed: {
    zIndex: 10,
    bottom: 0,
    position: "fixed",
    right: 0,
  },
}));
export default (props: { children?: React.ReactNode; background?: string }) => {
  const classes = useStyles();

  const user = useSelector(getUser);
  return (
    <LayoutBase background={props.background}>
      <div className={classes.root}>
        <ResponsiveMainColumn>{props.children}</ResponsiveMainColumn>
      </div>
      <div className={classes.bottomFixed}>
        {user && <FriendsPanel />}
        {user && <ChatsContainer />}
      </div>
    </LayoutBase>
  );
};
