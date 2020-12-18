import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useThunkDispatch } from "../..";
import {
  Chat,
  finishedChatsLoading,
  latestChatsSelector,
  tryOpenChat,
} from "../chat/chatReducer";
import { getLatestChats } from "../chat/reducer/getLatestChats";
import { getUser } from "../loginPage/authenticationReducer";
import ChatsList from "./ChatsList";

const useStyles = makeStyles((theme: Theme) => ({}));

const LatestChatsProvider = (props: any) => {
  const dispatch = useThunkDispatch();
  const loadedChats = useSelector(finishedChatsLoading);
  const latestChats = useSelector(latestChatsSelector);
  const user = useSelector(getUser);

  const handleChatClick = (friend: Chat) => {
    dispatch(tryOpenChat(friend.userId));
  };

  useEffect(() => {
    if (!loadedChats) {
      dispatch(getLatestChats(user!.id));
    }
  });

  return (
    <ChatsList
      onChatClick={handleChatClick}
      chatsLimit={5}
      chats={latestChats}
    ></ChatsList>
  );
};

export default LatestChatsProvider;
