using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FamilyTree.Entities;

namespace FamilyTree.Models
{
    public class TreeResponse
    {
        public int TreeId { get; set; }
        public string Name { get; set; }
        public bool IsPrivate { get; set; }
        public List<NodeResponse> Nodes { get; set; }
        public bool CanEdit { get; set; }
        public TreeResponse(Tree tree, User user)
        {
            TreeId = tree.TreeId; 
            Name = tree.Name;
            IsPrivate = tree.IsPrivate;
            Nodes = new List<NodeResponse>();
            bool userInTree = UserInTree(user, tree);
            CanEdit = userInTree || user.Role.Equals(Role.Admin) ? true : false;
            foreach(var node in tree.Nodes)
            {
                Nodes.Add(new NodeResponse(node, user, userInTree));
            }
        }
        private bool UserInTree(User user, Tree tree)
        {
            if (user.UserId == 0)
                return false;
            foreach(Node n in tree.Nodes)
            {
                if (n.UserId == user.UserId)
                    return true;
            }
            return false;
        }
    }
}
