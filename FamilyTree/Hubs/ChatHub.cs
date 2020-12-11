using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using FamilyTree.Services;
using FamilyTree.Entities;

namespace FamilyTree.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private IConnectionsService connectionsService;
        private IChatService chatService;
        public ChatHub(IConnectionsService connService, IChatService chatSer)
        {
            connectionsService = connService;
            chatService = chatSer;
        }
        public async Task SendMessage(string userIdString, string message)
        {
            int userId = int.Parse(userIdString);
            var fromId = int.Parse(Context.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name).Value);
            var mess = new Message
            {
                CreationTime = DateTime.Now,
                FromId = fromId,
                ToId = userId,
                Text = message
            };
            var connectionIdList = connectionsService.GetUserConnections(userId);
            if(connectionIdList.Count == 0)
            {
                mess.Sent = false;
                chatService.AddMessage(mess, fromId, userId);
            }
            else
            {
                await Clients.Clients(connectionIdList).SendAsync("ReceiveMessage", userId, message);
                mess.Sent = true;
                chatService.AddMessage(mess, fromId, userId);
            }
        }
        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
            var userId = int.Parse(Context.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name).Value);
            connectionsService.RegisterConnection(userId, Context.ConnectionId);
            List<Message> notSentMessages = chatService.MarkAsSent(userId);
            foreach(Message m in notSentMessages)
                await Clients.Caller.SendAsync("ReceiveMessage", m.FromId, m.Text);
        }
        public override Task OnDisconnectedAsync(Exception exception)
        {
            var userId = int.Parse(Context.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name).Value);
            connectionsService.DeleteConnection(userId, Context.ConnectionId);
            return base.OnDisconnectedAsync(exception);
        }
    }
}
