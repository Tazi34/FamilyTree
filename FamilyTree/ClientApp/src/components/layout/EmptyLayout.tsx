import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { useSelector } from "react-redux";
import ChatsContainer from "../chat/ChatsContainer";
import FriendsPanel from "../friendList/FriendsPanel";
import { getUser } from "../loginPage/authenticationReducer";
import LayoutBase from "./LayoutBase";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: "100%",
    width: "100%",
  },
  bottomFixed: {
    bottom: 0,
    position: "fixed",
    right: 0,
  },
}));
export default (props: { children?: React.ReactNode }) => {
  const classes = useStyles();
  const user = useSelector(getUser);
  return (
    <LayoutBase>
      <div className={classes.root}>{props.children}</div>
      <div className={classes.bottomFixed}>
        {user && <FriendsPanel />}
        {user && <ChatsContainer />}
      </div>
    </LayoutBase>
  );
};
