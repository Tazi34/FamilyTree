using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using FamilyTree.Entities;

namespace FamilyTree.Models
{
    public class CreateUserRequest
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Surname { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(6)]
        public string Password { get; set; }
        [Required]
        public DateTime Birthday { get; set; }
        [Required(AllowEmptyStrings = true)]
        public string MaidenName { get; set; }
        [RegularExpression(@"Male|Female|NotSure")]
        [Required]
        public string Sex { get; set; }
    }
}