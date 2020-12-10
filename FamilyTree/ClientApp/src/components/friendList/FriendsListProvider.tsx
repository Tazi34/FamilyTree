import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useThunkDispatch } from "../..";
import { Friend } from "../../model/Friend";
import { friendsList } from "../../samples/componentsSampleData";
import {
  latestsChatsSelector,
  finishedChatsLoading,
  getLatestChats,
  openChat,
  closeChat,
  currentChatsSelector,
} from "../chat/chatReducer";
import { getUser } from "../loginPage/authenticationReducer";
import FriendsList from "./FriendsList";

const useStyles = makeStyles((theme: Theme) => ({}));

const FriendsListProvider = (props: any) => {
  const dispatch = useThunkDispatch();
  const loadedChats = useSelector(finishedChatsLoading);
  const latestChats = useSelector(latestsChatsSelector.selectAll);
  const user = useSelector(getUser);

  const handleChatClick = (friend: Friend) => {
    dispatch(openChat(friend.id));
  };

  useEffect(() => {
    if (!loadedChats) {
      dispatch(getLatestChats(user!.id));
    }
  });

  return (
    <FriendsList
      onChatClick={handleChatClick}
      friendsLimit={5}
      friends={latestChats}
    ></FriendsList>
  );
};

export default FriendsListProvider;
