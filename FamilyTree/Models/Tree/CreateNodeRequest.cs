using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace FamilyTree.Models
{
    public class CreateNodeRequest
    {
        [Required]
        public int UserId { get; set; }
        [Required]
        public int TreeId { get; set; }
        [Required]
        public DateTime Birthday { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Surname { get; set; }
        public string PictureUrl { get; set; }
        [Required]
        public int FatherId { get; set; }
        [Required]
        public int MotherId { get; set; }
        [Required]
        [RegularExpression(@"Male|Female|NotSure")]
        public string Sex { get; set; }
        [Required]
        public List<int> Children { get; set; }
        [Required]
        public List<int> Partners { get; set; }
        [Required]
        public int X { get; set; }
        [Required]
        public int Y { get; set; }
    }
}
