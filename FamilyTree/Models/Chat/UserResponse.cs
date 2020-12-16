using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FamilyTree.Models
{
    public class UserResponse
    {
        public int UserId { get; set; }
        public DateTime LastMessageTime { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string PictureUrl { get; set; }
    }
}
