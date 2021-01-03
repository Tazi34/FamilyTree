
using System.ComponentModel.DataAnnotations;

namespace FamilyTree.Models
{
    public class AddSiblingRequest
    {
        [Required]
        public CreateNodeRequest NewNode {get;set;}

        [Required]
        public int SiblingId { get; set; }
    }
}
