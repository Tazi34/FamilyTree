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
        public TreeResponse(Tree tree)
        {
            TreeId = tree.TreeId; 
            Name = tree.Name;
            IsPrivate = tree.IsPrivate;
            Nodes = new List<NodeResponse>();
            foreach(var node in tree.Nodes)
            {
                Nodes.Add(new NodeResponse(node));
            }
        }
    }
}
