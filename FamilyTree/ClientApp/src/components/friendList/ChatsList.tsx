import { Box, Divider, List, makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";
import { Chat } from "../chat/chatReducer";
import ChatListEntry from "./ChatEntry";

type Props = {
  chatsLimit: number;
  chats: Chat[];
  onChatClick: (friend: Chat) => void;
};
const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

const ChatsList = ({ chats, chatsLimit, onChatClick }: Props) => {
  const classes = useStyles();

  const friendsToShow =
    chats.length > chatsLimit ? chats.slice(0, chatsLimit) : chats;
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      className={classes.root}
    >
      {friendsToShow.map((chat: Chat) => (
        <div key={chat.userId}>
          <ChatListEntry
            onChatClick={onChatClick}
            chatEntry={chat}
          ></ChatListEntry>
          <Divider />
        </div>
      ))}
    </Box>
  );
};

export default ChatsList;
