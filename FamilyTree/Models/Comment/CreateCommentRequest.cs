using System.ComponentModel.DataAnnotations;

namespace FamilyTree.Models
{
    public class CreateCommentRequest
    {
        [Required]
        public int PostId { get; set; }
        [Required]
        public string Text { get; set; }
    }
}
