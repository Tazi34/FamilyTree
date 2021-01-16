using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FamilyTree.Entities;
using System.ComponentModel.DataAnnotations;

namespace FamilyTree.Models
{
    public class AuthenticateResponse
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
        public string Token { get; set; }
        [Required]
        [RegularExpression(@"User|Admin")]
        public string Role { get; set; }
        [Required(AllowEmptyStrings = true)]
        public String MaidenName{ get; set;}
        [Required]
        public DateTime Birthday { get; set; }
        [Required]
        public string PictureUrl { get; set; }
        [Required]
        [RegularExpression(@"Male|Female|NotSure")]
        public string Sex { get; set; }
    }
}