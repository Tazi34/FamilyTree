using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FamilyTree.Entities
{
    public class Post
    {
        public int PostId { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public DateTime CreationTime { get; set; }
        public string Title { get; set; }
        public string Text { get; set; }
        public string PictureUrl { get; set; }
        public List<Comment> Comments { get; set; }
    }
}
