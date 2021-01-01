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
        public async Task SendMessage(string toIdString, string message)
        {
            int toId = int.Parse(toIdString);
            var fromId = int.Parse(Context.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name).Value);
            var mess = new Message
            {
                CreationTime = DateTime.Now,
                FromId = fromId,
                ToId = toId,
                Text = message
            };
            var (connectionIdList, isToIdActive) = connectionsService.GetMessageConnections(toId, fromId, Context.ConnectionId);
            if(isToIdActive)
                mess.Sent = true;
            else
                mess.Sent = false;
            await chatService.AddMessageAsync(mess, fromId, toId);
            if (connectionIdList.Count != 0)
                await Clients.Clients(connectionIdList).SendAsync("ReceiveMessage", fromId, message, mess.CreationTime.ToString());
        }
        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
            var userId = int.Parse(Context.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name).Value);
            connectionsService.RegisterConnection(userId, Context.ConnectionId);
            List<Message> notSentMessages = await chatService.MarkAsSentAsync(userId);
            foreach(Message m in notSentMessages)
                await Clients.Caller.SendAsync("ReceiveMessage", m.FromId, m.Text, m.CreationTime.ToString());
        }
        public override Task OnDisconnectedAsync(Exception exception)
        {
            var userId = int.Parse(Context.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name).Value);
            connectionsService.DeleteConnection(userId, Context.ConnectionId);
            return base.OnDisconnectedAsync(exception);
        }
    }
}
