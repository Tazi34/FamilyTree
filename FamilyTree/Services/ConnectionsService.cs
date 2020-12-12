using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FamilyTree.Services
{
    public interface IConnectionsService
    {
        List<string> GetUserConnections(int userId);
        void RegisterConnection(int userId, string connectionId);
        void DeleteConnection(int userId, string connectionId);
    }
    public class ConnectionsService : IConnectionsService
    {
        private Dictionary<int, List<string>> activeConnections = new Dictionary<int, List<string>>();

        public void DeleteConnection(int userId, string connectionId) => activeConnections[userId].Remove(connectionId);

        public List<string> GetUserConnections(int userId)
        {
            if(activeConnections.ContainsKey(userId))
                return activeConnections[userId];
            return new List<string>();
        }

        public void RegisterConnection(int userId, string connectionId)
        {
            if (activeConnections.ContainsKey(userId))
                activeConnections[userId].Add(connectionId);
            else
                activeConnections[userId] = new List<string> { connectionId };
        }
    }
}
