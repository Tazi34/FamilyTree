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
        public int X { get; set; }
        public int Y { get; set; }
        public List<int> Children { get; set; }
        public List<int> Partners { get; set; }
        public bool CanEdit { get; set; }
        
        //do drawable tree response : TODO co z tym zrobic
        public List<string> Families { get; set; }
        public NodeResponse(Node node, User user, bool userInTree)
        {
            NodeId = node.NodeId;
            UserId = node.UserId;
            TreeId = node.TreeId;
            Birthday = node.Birthday;
            Description = node.Description;
            Name = node.Name;
            Surname = node.Surname;
            PictureUrl = node.PictureUrl;
            var parentsTuple = MapParents(node);
            FatherId = parentsTuple.Item1;
            MotherId = parentsTuple.Item2;
            X = node.X;
            Y = node.Y;
            CanEdit = user.Role.Equals(Role.Admin) || (node.UserId == 0 && userInTree) || (node.UserId == user.UserId && user.UserId != 0) ? true : false; 
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
            Families = new List<string>();
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="node"></param>
        /// <returns>item1 - father, item2 - mother</returns>
        private (int, int) MapParents (Node node)
        {
            if (node.Parents.Count == 0)
                return (0, 0);
            else if (node.Parents.Count == 1)
            {
                if (node.Parents[0].Parent.Sex.Equals(Sex.Female))
                    return (0, node.Parents[0].ParentId);
                else
                    return (node.Parents[0].ParentId, 0);
            }
            else
            {
                if (node.Parents[0].Parent.Sex.Equals(Sex.Female))
                    return (node.Parents[1].ParentId, node.Parents[0].ParentId);
                else
                    return (node.Parents[0].ParentId, node.Parents[1].ParentId);
            }
        }
    }
}
