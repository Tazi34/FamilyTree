using System;
using System.Collections.Generic;

namespace FamilyTree.Models
{
    public class CommentsListResponse
    {
        public int PostId { get; set; }
        public List<CommentResponse> Comments {get; set;}
    }
    public class CommentResponse
    {
        public int CommentId { get; set; }
        public DateTime Time { get; set; }
        public string Text { get; set; }
        public UserInfoResponse User {get; set;}
    }
}
