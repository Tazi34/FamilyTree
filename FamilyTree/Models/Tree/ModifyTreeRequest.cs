using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace FamilyTree.Models
{
    public class ModifyTreeRequest
    {
        [Required]
        public int TreeId { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public bool IsPrivate { get; set; }
    }
}
