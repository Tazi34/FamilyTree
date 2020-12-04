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
        public List<Child> Children { get; set; }
    }
}
