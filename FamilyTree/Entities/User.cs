using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FamilyTree.Models;

namespace FamilyTree.Entities
{
    public class User
    {
        public int UserId { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Salt { get; set; }
        public string Role { get; set; }
        public DateTime Birthday { get; set; }
        public string PictureUrl { get; set; }
        public List<PreviousSurname> PrevSurnames { get; set; }
        public string Sex { get; set; }
        public List<Chat> Chats1 { get; set; }
        public List<Chat> Chats2 { get; set; }
        public List<Invitation> HostedInvitations { get; set; }
        public List<Invitation> AskedInvitations { get; set; }
        public List<Comment> UserComments { get; set; }
        public List<Post> Posts { get; set; }
    }
}
