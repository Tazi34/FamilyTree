using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace FamilyTree.Models
{
    public class CreateTreeRequest
    {
        [Required]
        public string TreeName { get; set; }
        [Required]
        public bool IsPrivate { get; set; }
    }
}
