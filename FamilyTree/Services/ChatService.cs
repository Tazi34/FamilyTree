using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FamilyTree.Helpers;
using FamilyTree.Entities;
using Microsoft.EntityFrameworkCore;

namespace FamilyTree.Services
{
    public interface IChatService
    {
        public void AddMessage(Message mess, int user1Id, int user2Id);
        public List<Message> MarkAsSent(int userId);
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
                return AddNewChat(lesserUserId, greaterUserId);
            return chat.ChatId;
        }
        private int AddNewChat(int lesserUserId, int greaterUserId)
        {
            var chat = new Chat
            {
                User1Id = lesserUserId,
                User2Id = greaterUserId
            };
            context.Chats.Add(chat);
            context.SaveChanges();
            return chat.ChatId;
        }
    }
}
