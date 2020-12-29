using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FamilyTree.Models
{
    public class TreeSearchResponse
    {
        public int TreeId { get; set; }
        public string Name { get; set; }
        public bool IsPrivate { get; set; }
    }
}
