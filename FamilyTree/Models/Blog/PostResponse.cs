using System;

namespace FamilyTree.Models
{
    public class PostResponse
    {
        public int PostId { get; set; }
        public int UserId { get; set; }
        public DateTime CreationTime { get; set; }
        public string Title { get; set; }
        public string Text { get; set; }
        public string PictureUrl { get; set; }
        public UserInfoResponse User { get; set; }
    }
}
