using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FamilyTree.Helpers
{
    public enum TreeAuthLevel
    {
        Error = 1,
        Everybody = 2,
        PublicTree = 3,
        InTree = 4,
        InNode = 5,
        Admin = 6
    }
}
