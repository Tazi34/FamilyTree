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
        public Role Role { get; set; }
        public DateTime Birthday { get; set; }
        public string PictureUrl { get; set; }
        public List<PreviousSurname> PrevSurnames { get; set; }
    }
}
