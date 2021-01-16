using System.ComponentModel.DataAnnotations;

namespace FamilyTree.Models
{
    public class AcceptRefuseInvitationRequest
    {
        [Required]
        public int InvitationId { get; set; }
        [Required]
        public int UserId { get; set; }
    }
}
