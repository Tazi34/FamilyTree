using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FamilyTree.Entities
{
    public class Node
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
        public List<NodeNode> Children { get; set; }
        public List<NodeNode> Parents { get; set; }
        public string Sex { get; set; }
        public List<NodeNodeMarriage> Partners1 { get; set; }
        public List<NodeNodeMarriage> Partners2 { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
    }
}
