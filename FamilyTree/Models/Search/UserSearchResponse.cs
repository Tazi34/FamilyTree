﻿
namespace FamilyTree.Models
{
    public class UserSearchResponse
    {
        public int UserId { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string MaidenName { get; set; }
        public string PictureUrl { get; set; }
    }
}
