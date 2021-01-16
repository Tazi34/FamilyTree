using System.ComponentModel.DataAnnotations;

namespace FamilyTree.Models
{
    public class CreatePostRequest
    {
        [Required]
        public string Title { get; set; }
        [Required]
        public string Text { get; set; }
        public string PictureUrl { get; set; }
    }
}
