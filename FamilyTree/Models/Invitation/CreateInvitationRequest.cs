using System.ComponentModel.DataAnnotations;

namespace FamilyTree.Models
{
    public class CreateInvitationRequest
    {
        [Required]
        public int HostUserId { get; set; }
        [Required]
        public int AskedUserId { get; set; }
        [Required]
        public int TreeId { get; set; }
    }
}
