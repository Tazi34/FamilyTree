using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FamilyTree.Helpers;
using FamilyTree.Entities;
using Microsoft.EntityFrameworkCore;
using FamilyTree.Models;

namespace FamilyTree.Services
{
    public interface IChatService
    {
        public void AddMessage(Message mess, int user1Id, int user2Id);
        public List<Message> MarkAsSent(int userId);
        public MessagesListResponse GetMessages(int user1, int user2);
        public UsersListResponse GetLastUsersList(int userId);
    }
    public class ChatService : IChatService
    {
        private DataContext context;
        public ChatService(DataContext dataContext)
        {
            context = dataContext;
        }

        public void AddMessage(Message mess, int user1Id, int user2Id)
        {
            mess.ChatId = GetChatId(user1Id, user2Id);
            if(mess.ChatId == -1)
            {
                mess.ChatId = AddNewChat(user1Id, user2Id);
            }
            Chat chat = context.Chats.SingleOrDefault(c => c.ChatId == mess.ChatId);
            chat.LastMessageTime = mess.CreationTime;
            context.Chats.Update(chat);
            context.Messages.Add(mess);
            context.SaveChanges();
        }

        public List<Message> MarkAsSent(int userId)
        {
            var messageList = context.Messages.Where(m => m.ToId == userId && m.Sent == false).ToList();
            foreach (Message m in messageList)
            {
                m.Sent = true;
                context.Messages.Update(m);
            }
            context.SaveChanges();
            return messageList;
        }
        private int GetChatId (int user1Id, int user2Id)
        {
            int lesserUserId = user1Id < user2Id ? user1Id : user2Id;
            int greaterUserId = user1Id < user2Id ? user2Id : user1Id;
            var chat = context.Chats.SingleOrDefault(c => c.User1Id == lesserUserId && c.User2Id == greaterUserId);
            if (chat == null)
                return -1;
            return chat.ChatId;
        }
        private int AddNewChat(int user1Id, int user2Id)
        {
            int lesserUserId = user1Id < user2Id ? user1Id : user2Id;
            int greaterUserId = user1Id < user2Id ? user2Id : user1Id;
            var chat = new Chat
            {
                User1Id = lesserUserId,
                User2Id = greaterUserId
            };
            context.Chats.Add(chat);
            context.SaveChanges();
            return chat.ChatId;
        }

        public MessagesListResponse GetMessages(int user1, int user2)
        {
            int chatId = GetChatId(user1, user2);
            if (chatId == -1)
                return null;
            var messagesList = context.Messages.Where(m => m.ChatId == chatId).OrderByDescending(m => m.CreationTime).Take(100).ToList();
            var resultList = new MessagesListResponse
            {
                MessageList = new List<MessageResponse>()
            };
            foreach(Message m in messagesList)
            {
                resultList.MessageList.Add(new MessageResponse
                {
                    CreationTime = m.CreationTime,
                    Text = m.Text,
                    FromId = m.FromId,
                    ToId = m.ToId
                });
            }
            return resultList;
        }

        public UsersListResponse GetLastUsersList(int userId)
        {
            var chatList = context.Chats.Where(c => c.User1Id == userId || c.User2Id == userId).OrderByDescending(c => c.LastMessageTime).Take(10);
            if (chatList == null)
                return null;
            var resultList = new UsersListResponse
            {
                UsersList = new List<UserResponse>()
            };
            foreach(Chat c in chatList)
            {
                resultList.UsersList.Add(new UserResponse
                {
                    LastMessageTime = c.LastMessageTime,
                    UserId = userId == c.User1Id ? c.User2Id : c.User1Id
                });
            }
            return resultList;
        }
    }
}
