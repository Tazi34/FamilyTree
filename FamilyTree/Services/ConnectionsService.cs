using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FamilyTree.Services
{
    public interface IConnectionsService
    {
        (List<string>, bool) GetMessageConnections(int toId, int fromId, string fromConnection);
        void RegisterConnection(int userId, string connectionId);
        void DeleteConnection(int userId, string connectionId);
    }
    public class ConnectionsService : IConnectionsService
    {
        private Dictionary<int, List<string>> activeConnections = new Dictionary<int, List<string>>();

        public void DeleteConnection(int userId, string connectionId) => activeConnections[userId].Remove(connectionId);

        public (List<string>, bool) GetMessageConnections(int toId, int fromId, string fromConnection)
        {
            var result = new List<string>();
            var IsToIdActive = true;
            if (activeConnections.ContainsKey(toId))
                result.AddRange(activeConnections[toId]);
            else
                IsToIdActive = false;
            if (activeConnections.ContainsKey(fromId))
                result.AddRange(activeConnections[fromId].Where(c => !c.Equals(fromConnection)).ToList());
            return (result, IsToIdActive);
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
