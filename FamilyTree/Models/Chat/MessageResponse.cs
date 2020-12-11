using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FamilyTree.Models
{
    public class MessageResponse
    {
        public DateTime CreationTime { get; set; }
        public int FromId { get; set; }
        public int ToId { get; set; }
        public string Text { get; set; }
    }
}
