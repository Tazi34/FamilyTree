using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FamilyTree.Models
{
    public class CreateTreeRequest
    {
        public string TreeName { get; set; }
        public bool IsPrivate { get; set; }
    }
}
