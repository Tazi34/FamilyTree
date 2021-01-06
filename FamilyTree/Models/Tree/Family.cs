using System.Collections.Generic;

namespace FamilyTree.Models
{
    public class Family
    {
        public string Id {get;set;}
        public int TreeId {get;set;}
        public int? FirstParentId { get; set; }
        public int? SecondParentId {get;set;}
        public List<int> Children { get; set; }
        public int X { get; set; }
        public int Y { get; set; }

    }
}
