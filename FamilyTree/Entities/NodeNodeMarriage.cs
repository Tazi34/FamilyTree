using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FamilyTree.Entities
{
    public class NodeNodeMarriage
    {
        public int Partner1Id { get; set; }
        public Node Partner1 { get; set; }
        public int Partner2Id { get; set; }
        public Node Partner2 { get; set; }
    }
}
