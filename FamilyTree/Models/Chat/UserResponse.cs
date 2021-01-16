using System;

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
