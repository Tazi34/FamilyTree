using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace FamilyTree.Models
{
    public class HideRequest
    {
        [Required]
        public List<int> Nodes { get; set; }
    }
}
