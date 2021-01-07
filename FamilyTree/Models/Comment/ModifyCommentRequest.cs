using System.ComponentModel.DataAnnotations;

namespace FamilyTree.Models
{
    public class ModifyCommentRequest
    {
        [Required]
        public int CommentId { get; set; }
        [Required]
        public string Text { get; set; }
    }
}
