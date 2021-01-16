using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FamilyTree.Models
{
    public class ShowHideRequest
    {
        [Required]
        public List<string> Families { get; set; }

        [Required]
        public int TreeId { get; set; }

        [Required]
        public bool Show { get; set; }

        [Required]
        public List<string> HiddenFamilies { get; set; }

        [Required]
        public List<int> HiddenNodes { get; set; }

    }
}
