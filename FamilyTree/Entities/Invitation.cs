using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FamilyTree.Entities
{
    public class Invitation
    {
        public int InvitationId { get; set; }
        public User Host { get; set; }
        public User AskedUser { get; set; }
        public Tree Tree { get; set; }
        public int TreeId { get; set; }
        public int HostId { get; set; }
        public int AskedUserId { get; set; }
    }
}
