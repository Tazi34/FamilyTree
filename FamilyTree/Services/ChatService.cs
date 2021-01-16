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
        public Task AddMessageAsync(Message mess, int user1Id, int user2Id);
        public Task<List<Message>> MarkAsSentAsync(int userId);
        public Task<MessagesListResponse> GetMessagesAsync(int user1, int user2);
        public Task<UsersListResponse> GetLastUsersListAsync(int userId);
        public Task<UserInfoResponse> GetChatUserInfoAsync(int userId); 
    }
    public class ChatService : IChatService
    {
        private DataContext context;
        public ChatService(DataContext dataContext)
        {
            context = dataContext;
        }

        public async Task AddMessageAsync(Message mess, int user1Id, int user2Id)
        {
            mess.ChatId = await GetChatIdAsync(user1Id, user2Id);
            if(mess.ChatId == -1)
            {
                mess.ChatId = await AddNewChatAsync(user1Id, user2Id);
            }
            Chat chat = await context.Chats.FirstOrDefaultAsync(c => c.ChatId == mess.ChatId);
            chat.LastMessageTime = mess.CreationTime;
            context.Chats.Update(chat);
            context.Messages.Add(mess);
            await context.SaveChangesAsync();
        }

        public async Task<List<Message>> MarkAsSentAsync(int userId)
        {
            var messageList = await context.Messages.Where(m => m.ToId == userId && m.Sent == false).ToListAsync();
            foreach (Message m in messageList)
            {
                m.Sent = true;
                context.Messages.Update(m);
            }
            await context.SaveChangesAsync();
            return messageList;
        }
        private async Task<int> GetChatIdAsync (int user1Id, int user2Id)
        {
            int lesserUserId = user1Id < user2Id ? user1Id : user2Id;
            int greaterUserId = user1Id < user2Id ? user2Id : user1Id;
            var chat = await context.Chats.FirstOrDefaultAsync(c => c.User1Id == lesserUserId && c.User2Id == greaterUserId);
            if (chat == null)
                return -1;
            return chat.ChatId;
        }
        private async Task<int> AddNewChatAsync(int user1Id, int user2Id)
        {
            int lesserUserId = user1Id < user2Id ? user1Id : user2Id;
            int greaterUserId = user1Id < user2Id ? user2Id : user1Id;
            var chat = new Chat
            {
                User1Id = lesserUserId,
                User2Id = greaterUserId
            };
            context.Chats.Add(chat);
            await context.SaveChangesAsync();
            return chat.ChatId;
        }

        public async Task<MessagesListResponse> GetMessagesAsync(int user1, int user2)
        {
            int chatId = await GetChatIdAsync(user1, user2);
            if (chatId == -1)
            {
                chatId = await AddNewChatAsync(user1, user2);
            }

            var messagesList = await context.Messages.Where(m => m.ChatId == chatId).OrderByDescending(m => m.CreationTime).Take(100).ToListAsync();
            var resultList = new MessagesListResponse
            {
                MessageList = new List<MessageResponse>(),

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

        public async Task<UsersListResponse> GetLastUsersListAsync(int userId)
        {
            var chatList = await context.Chats
                .Include(c => c.User1)
                .Include(c => c.User2)
                .Where(c => c.User1Id == userId || c.User2Id == userId)
                .OrderByDescending(c => c.LastMessageTime)
                .Take(10)
                .ToListAsync();
            if (chatList == null)
                return null;
            var resultList = new UsersListResponse
            {
                UsersList = new List<UserResponse>()
            };
            foreach(Chat c in chatList)
            {
                bool userNo1 = userId == c.User1Id ? false : true;
                if (userNo1)
                {
                    resultList.UsersList.Add(new UserResponse
                    {
                        LastMessageTime = c.LastMessageTime,
                        UserId = c.User1Id,
                        Name = c.User1.Name,
                        Surname = c.User1.Surname,
                        PictureUrl = c.User1.PictureUrl
                    });
                }
                else
                {
                    resultList.UsersList.Add(new UserResponse
                    {
                        LastMessageTime = c.LastMessageTime,
                        UserId = c.User2Id,
                        Name = c.User2.Name,
                        Surname = c.User2.Surname,
                        PictureUrl = c.User2.PictureUrl
                    });
                }
            }
            return resultList;
        }

        public async Task<UserInfoResponse> GetChatUserInfoAsync(int userId)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null)
                return null;
            return new UserInfoResponse
            {
                Name = user.Name,
                Surname = user.Surname,
                MaidenName = user.MaidenName,
                PictureUrl = user.PictureUrl,
                UserId = user.UserId
            };
        }
    }
}
