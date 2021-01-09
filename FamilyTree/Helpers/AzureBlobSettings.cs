using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FamilyTree.Helpers
{
    public class AzureBlobSettings
    {
        public const string Position = "AzureBlobSettings";
        public string ConnectionString { get; set; }
        public string BlogContainer { get; set; }
        public string NodeContainer { get; set; }
        public string ProfileContainer { get; set; }
    }
}
