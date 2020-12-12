using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FamilyTree.Entities
{
    public class Chat
    {
        public int ChatId { get; set; }
        public int User1Id { get; set; }
        public int User2Id { get; set; }
        public List<Message> Messages { get; set; }
        public DateTime LastMessageTime {get; set;}
    }
}
