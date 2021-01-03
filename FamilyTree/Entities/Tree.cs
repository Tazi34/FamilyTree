using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FamilyTree.Entities
{
    public class Tree
    {
        public int TreeId { get; set; }
        public string Name { get; set; }
        public bool IsPrivate { get; set; }
        public List<Node> Nodes { get; set; }
        public List<Invitation> Invitations { get; set; }
    }
}
