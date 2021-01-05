using System.ComponentModel.DataAnnotations;

namespace FamilyTree.Models
{
    public class ConnectPartnersRequest
    {
        [Required]
        public int FirstPartnerId { get; set; }
        [Required]
        public int SecondPartnerId { get; set; }
    }
}
