using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FamilyTree.Entities
{
    public class Message
    {
        public int MessageId { get; set; }
        public int ChatId { get; set; }
        public DateTime CreationTime { get; set; }
        public int FromId { get; set; }
        public int ToId { get; set; }
        public string Text { get; set; }
        public bool Sent { get; set; }
        public virtual Chat Chat { get; set; }
    }
}
