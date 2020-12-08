using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FamilyTree.Entities;

namespace FamilyTree.Models
{
    public class NodeResponse
    {
        public int NodeId { get; set; }
        public int UserId { get; set; }
        public int TreeId { get; set; }
        public DateTime Birthday { get; set; }
        public string Description { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string PictureUrl { get; set; }
        public int FatherId { get; set; }
        public int MotherId { get; set; }
        public List<int> Children { get; set; }
        public List<int> Partners { get; set; }
        public NodeResponse(Node node)
        {
            NodeId = node.NodeId;
            UserId = node.UserId;
            TreeId = node.TreeId;
            Birthday = node.Birthday;
            Description = node.Description;
            Name = node.Name;
            Surname = node.Surname;
            PictureUrl = node.PictureUrl;
            FatherId = node.FatherId;
            MotherId = node.MotherId;
            Children = new List<int>();
            foreach(var child in node.Children)
            {
                Children.Add(child.ChildId);
            }
            Partners = new List<int>();
            foreach (var partner in node.Partners1)
            {
                Partners.Add(partner.Partner1Id);
            }
        }
    }
}
