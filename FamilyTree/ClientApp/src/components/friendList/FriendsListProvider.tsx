import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { friendsList } from "../../samples/componentsSampleData";
import FriendsList from "./FriendsList";

const useStyles = makeStyles((theme: Theme) => ({}));

const FriendsListProvider = (props: any) => {
  const classes = useStyles();
  return <FriendsList friends={friendsList}></FriendsList>;
};

export default FriendsListProvider;
