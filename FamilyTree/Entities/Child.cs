using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FamilyTree.Entities
{
    public class Child
    {
        public int ChildId { get; set; }
        public int NodeId { get; set; }
        public int ChildPointer { get; set; }
    }
}
