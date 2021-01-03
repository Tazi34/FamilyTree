using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
