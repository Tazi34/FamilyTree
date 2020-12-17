using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace FamilyTree.Models
{
    public class ModifyUserRequest
    {
        [Required]
        public int UserId { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Surname { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public DateTime Birthday { get; set; }
        [Required]
        public List<string> PreviousSurnames { get; set; }
        [Required]
        [RegularExpression(@"Male|Female|NotSure")]
        public string Sex { get; set; }
    }
}