using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FamilyTree.Entities
{
    public class NodeNode
    {
        public int ChildId { get; set; }
        public Node Child { get; set; }
        public int ParentId { get; set; }
        public Node Parent { get; set; }
    }
}