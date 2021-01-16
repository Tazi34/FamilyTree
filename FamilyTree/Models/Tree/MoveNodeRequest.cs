using System.ComponentModel.DataAnnotations;

namespace FamilyTree.Models
{
    public class MoveNodeRequest
    {
        [Required]
        public int NodeId { get; set; }
        [Required]
        public int X { get; set; }
        [Required]
        public int Y { get; set; }
    }
}
